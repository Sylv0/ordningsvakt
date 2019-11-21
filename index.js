const mong = require("mongoose")
const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()

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

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`)
})

client.login(process.env.DISCORD_BOT_TOKEN)
