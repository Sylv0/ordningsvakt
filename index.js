require("dotenv").config();
const path = require("path");
const prettyms = require("pretty-ms");
const dateformat = require("dateformat");
const { RichEmbed } = require("discord.js");
const { CommandoClient } = require("discord.js-commando");
const client = new CommandoClient({
  owner: "131096116849672192",
  commandPrefix: process.env.COMMAND_PREFIX
});

const knex = require("./db/knex");

active_members = {};

const updateTimeInterval = () => {
  const curMonth = dateformat(new Date(), "yyyy mm");
  const interval = setInterval(() => {
    if (!Object.keys(active_members).length) {
      console.log("Clear update interval");
      clearInterval(interval);
      return;
    }
    Object.keys(active_members).map(async (id) => {
      const curTime = new Date().getTime();
      const { username } = await client.fetchUser(id);
      const timeDelta = curTime - active_members[id];
      active_members[id] = curTime;
      const member_activity = await knex("user_activity")
        .select()
        .where({
          member: id,
          month: curMonth
        })
        .first();
      if (!member_activity) {
        await knex("user_activity").insert({
          member: id,
          name: username,
          month: curMonth,
          active_time: timeDelta
        });
      } else {
        await knex("user_activity")
          .update({
            active_time: member_activity.active_time + timeDelta
          })
          .where({
            member: id,
            month: curMonth
          });
      }
    });
  }, 5000);
};

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["util", "Utility commands for our Orwell society."],
    ["fun", "Fun commands with limited functionality."]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`);
  client.user.setActivity("you all.", { type: "WATCHING" });
});

client.on("voiceStateUpdate", async (before, after) => {
  try {
    const { id, username } = after.user;
    const curTime = new Date().getTime();
    const curMonth = dateformat(new Date(), "yyyy mm");
    if (!before.voiceChannel && after.voiceChannel) {
      active_members[id] = curTime;
      if (Object.keys(active_members).length === 1) updateTimeInterval();
    } else if (
      before.voiceChannel &&
      !after.voiceChannel &&
      active_members[id]
    ) {
      const timeDelta = curTime - active_members[id];
      const member_activity = await knex("user_activity")
        .select()
        .where({
          member: id,
          month: curMonth
        })
        .first();
      if (!member_activity) {
        await knex("user_activity").insert({
          member: id,
          name: username,
          month: curMonth,
          active_time: timeDelta
        });
      } else {
        await knex("user_activity")
          .update({
            active_time: member_activity.active_time + timeDelta
          })
          .where({
            member: id,
            month: curMonth
          });
      }
      delete active_members[id];
    }
  } catch (e) {
    console.log(e);
  }
});

client.on("guildMemberAdd", (member) => {
  console.log(`Member ${member.user.username} joined server.`);
  member.addRole("646003405432815621");
  const { guild } = member;
  if (guild && guild.available) {
    const channel = guild.channels.find((ch) => ch.name === "welcome");
    if (channel) {
      channel.send(`Welcome to the gang, ${member.user.username}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
