require("dotenv").config()
const path = require("path")
const prettyms = require("pretty-ms")
const dateformat = require("dateformat")
const { RichEmbed } = require("discord.js")
const { CommandoClient } = require("discord.js-commando")
const client = new CommandoClient({
  owner: "131096116849672192",
  commandPrefix: process.env.COMMAND_PREFIX
})

const { UserActivity } = require("./mySchema")

active_members = {}

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["util", "Utility commands for our Orwell society."],
    ["fun", "Fun commands with limited functionality."]
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"))

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`)
  client.user.setActivity("you all.", { type: "WATCHING" })
})

client.on("voiceStateUpdate", async (before, after) => {
  try {
    const { id, username } = after.user
    const curTime = new Date().getTime()
    const curMonth = dateformat(new Date(), "yyyy mm")
    if (!before.voiceChannel && after.voiceChannel) {
      active_members[id] = curTime
    } else if (
      before.voiceChannel &&
      !after.voiceChannel &&
      active_members[id]
    ) {
      const timeDelta = curTime - active_members[id]
      const member_activity = await UserActivity.findOne({
        member: id,
        month: curMonth
      })
      if (!member_activity) {
        await UserActivity.create({
          member: id,
          name: username,
          month: curMonth,
          active_time: timeDelta
        })
      } else {
        await UserActivity.updateOne(
          { member: id, month: curMonth },
          { active_time: member_activity.active_time.toNumber() + timeDelta }
        )
      }
      delete active_members[id]
    }
  } catch (e) {
    console.log(e)
  }
})

client.on("guildMemberAdd", member => {
  console.log(`Member ${member.user.username} joined server.`)
  member.addRole("646003405432815621")
  const { guild } = member
  if (guild && guild.available) {
    const channel = guild.channels.find(ch => ch.name === "welcome")
    if (channel) {
      channel.send(`Welcome to the gang, ${member.user.username}`)
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
