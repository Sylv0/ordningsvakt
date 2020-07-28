const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");

const jslrs = require("js-longest-repeated-substring");

const generateFieldMessage = (arr = []) => {
  const sliceAmount = 3;
  if (arr.length <= sliceAmount) return arr.join("\n");
  else {
    const items = arr.slice(0, sliceAmount);
    const additonal = arr.length - sliceAmount;
    items.push(`+ ${additonal} more`);
    return arr.join("\n");
  }
};

const getServerName = (text = "") => {
  const substring = jslrs.lrs(text);
  if (substring.length > 10) return substring.slice(4);
  const regx = / on ([\w\W]+)/g;
  const matches = regx.exec(text);
  return matches[1];
};

module.exports = class ActivityCommand extends Command {
  constructor(client) {
    super(client, {
      name: "servers",
      aliases: ["srvs"],
      group: "util",
      memberName: "servers",
      description: "Display Squad servers being played on right now."
    });
  }

  run(msg) {
    const embed = new RichEmbed()
      .setTitle("Currently played servers")
      .setDescription("These servers are currently being played on.")
      .setColor(0x2233ff);
    let activities = {};
    this.client.guilds.map((guild) => {
      guild.presences.map((p, index, presences) => {
        const user = this.client.users.get(index).username;
        p.activities.map((a) => {
          if (a.name === "Squad" && a.assets && a.assets.largeText) {
            if (activities[a.assets.largeText]) {
              activities[a.assets.largeText].push(user);
            } else {
              activities[a.assets.largeText] = [user];
            }
          }
        });
      });
    });
    Object.values(activities).map((a, index) => {
      const server = Object.keys(activities)[index];
      const name = getServerName(server);
      if (!server.includes("[C] CAROLEANS"))
        embed.addField(name, generateFieldMessage(a));
    });
    if (Object.keys(activities).length <= 0)
      embed.setDescription("Nobody is playing :(");
    return msg.embed(embed);
  }
};
