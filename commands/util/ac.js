const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const dateformat = require("dateformat");
const prettms = require("pretty-ms");
const knex = require("../../db/knex");

module.exports = class ActivityCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ac",
      aliases: ["activity"],
      group: "util",
      memberName: "activity",
      description: "Display monthly user activity."
    });
  }

  run(msg) {
    const embed = new RichEmbed()
      .setTitle("Monthly Activity")
      .setDescription(
        "Active time(time in voice channel) for members this month."
      )
      .setColor(0x2233ff);

    const curMonth = dateformat(new Date(), "yyyy mm");

    knex("user_activity")
      .select()
      .where({
        month: curMonth
      })
      .limit(25)
      .then((rows) => {
        rows
          .sort((a, b) => {
            return b.active_time - a.active_time;
          })
          .map((row) => {
            embed.addField(row.name, `${prettms(row.active_time)}`, false);
          });

        return msg.embed(embed);
      });
  }
};
