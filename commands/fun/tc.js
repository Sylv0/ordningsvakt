const { Command } = require("discord.js-commando")
const fs = require("fs")

module.exports = class TerritoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "tc",
      aliases: ["territory-control"],
      group: "fun",
      memberName: "territory_control",
      description: "Sends a picture of opinions."
    })
  }

  run(msg) {
    return msg.say({
      file: "./images/tc_skorpo.png"
    })
  }
}
