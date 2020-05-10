const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
  name: 'report',
  category: 'moderation',
  description: 'report a member',
  usage: '<metion | id>',
  execute: async (client, message, args) => {
    if(message.deletable) message.delete();

    let toReport = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!toReport)
      return message.reply("Couldn't find that member!").then(m => m.delete(5000));
    
    if(toReport.hasPermission('BAN_MEMBERS') || toReport.user.bot)
      return message.reply("Can't report that member").then(m => m.delete(5000));

    if(!args[1])
      return message.channel.send("Please provide a reason for the report!").then(m => m.delete(5000));

    const channel = message.guild.channels.find(channel => channel.name === 'reports');

    if(!channel)
      return message.channel.send("I could not find a \`#reports\` channel").then(m => m.delete(5000));

    const embed = new RichEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL)
      .setAuthor('Reported Member', toReport.user.displayAvatarURL)
      .setDescription(stripIndents`**Member: **${toReport} (${toReport.id})
      **Reported by: **${message.author} (${message.author.id})
      **Reported in: **${message.channel}
      **Reason: **${args.slice(1).join(' ')}`);

      channel.send(embed);
  }
}