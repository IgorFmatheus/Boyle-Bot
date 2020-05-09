const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'ping',
  category: 'info',
  description: 'Returns the bot and Api ping',
  execute: async (client, message, args) => {
     await message.reply(`🏓 Pinging`).then( m => {

      const embed = new RichEmbed()
        .setDescription(`🏓 Pong`)
        .setColor('RANDOM')
        .setThumbnail(client.user.displayAvatarURL)
        .addField('Bot ping', `**${Math.floor(m.createdTimestamp - message.createdTimestamp)} ms**`)
        .addField('Api Ping', `**${Math.round(client.ping)} ms**`);

      m.delete();
      message.delete();
      message.channel.send(embed);
    });
  }
}