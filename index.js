const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}`);
})

client.login(process.env.DISCORD_BOT_TOKEN)