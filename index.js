require("dotenv").config()
const path = require("path")
const mong = require("mongoose")
const { RichEmbed } = require("discord.js")
const { CommandoClient } = require("discord.js-commando")
const client = new CommandoClient({
  owner: "131096116849672192",
  commandPrefix: process.env.COMMAND_PREFIX
})

mong.connect(`${process.env.MONGO_HOST_URI}/squadgang_data`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UserActivity = mong.model("user_activity", {
  member: Number,
  name: String,
  month: String,
  active_time: Number
})

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility commands for our Orwell society.'],
		['fun', 'Fun commands with limited functionality.'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`)
  client.user.setActivity("you all.", { type: "WATCHING"})
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
