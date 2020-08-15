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

const UserActivity = require("./core/UserActivity");

active_members = {};

const isAfk = (voiceChannel) => {
  return voiceChannel && voiceChannel.id === voiceChannel.guild.afkChannelID;
};

let intervalRunning = false;

const updateTimeInterval = () => {
  if (!intervalRunning && Object.keys(active_members).length) {
    const interval = setInterval(() => {
      if (!Object.keys(active_members).length) {
        console.log("Clear update interval");
        clearInterval(interval);
        intervalRunning = false;
        return;
      }
      Object.keys(active_members).map(async (id) => {
        active_members[id].insertTime();
      });
    }, 10000);
    intervalRunning = true;
  }
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
  const voiceChannels = client.channels.filter(
    (c) => c.type === "voice" && !isAfk(c)
  );
  voiceChannels.map((c) => {
    c.members.map((m) => {
      const joined = new UserActivity(m.user);
      active_members[m.user.id] = joined;
    });
  });
  updateTimeInterval();
});

client.on("voiceStateUpdate", async (before, after) => {
  try {
    const { id } = after.user;
    if (
      (isAfk(before.voiceChannel) || !before.voiceChannel) &&
      after.voiceChannel &&
      !isAfk(after.voiceChannel)
    ) {
      const joined = new UserActivity(after.user);
      active_members[id] = joined;
      updateTimeInterval();
    } else if (
      before.voiceChannel &&
      (!after.voiceChannel || isAfk(after.voiceChannel)) &&
      active_members[id]
    ) {
      active_members[id].insertTime();
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
    const channel = guild.channels.find((ch) => ch.name.includes("welcome"));
    if (channel) {
      channel.send(`Welcome to the gang, ${member.user.username}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
