const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
const dateformat = require("dateformat")
const prettms = require("pretty-ms")
const { UserActivity } = require("../../mySchema")

module.exports = class ActivityCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ac",
      aliases: ["activity"],
      group: "util",
      memberName: "activity",
      description: "Display monthly user activity."
    })
  }

  run(msg) {
    const embed = new RichEmbed()
      .setTitle("Monthly Activity")
      .setDescription(
        "Active time(time in voice channel) for members this month."
      )
      .setColor(0x0000ff)

    const curMonth = dateformat(new Date(), "yyyy mm")

    UserActivity.find({ month: curMonth })
      .sort("active_time")
      .then(res => {
        res
          .sort((a, b) => {
            return b.active_time.toNumber() - a.active_time.toNumber()
          })
          .map(post => {
            embed.addField(
              post.name,
              `${prettms(post.active_time.toNumber())}`,
              false
            )
          })

        return msg.embed(embed)
      })
  }
}
