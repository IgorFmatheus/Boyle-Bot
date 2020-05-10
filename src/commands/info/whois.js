const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getMember, formatDate } = require('../../functions');

module.exports = {
  name: 'whois',
  aliases: ['userInfo', 'user', 'who', 'info'],
  category: 'info',
  description: 'Returns user info',
  usage: '[username | user | metion]',
  execute: async (client, message, args) => {
    if(message.deletable) message.delete();

    const member = getMember(message, args.join(' '));

    //Member Variables
    const joined = formatDate(member.joinedAt);
    const roles = member.roles
      .filter(role => role.id === message.guild.id)
      .map(r => r)
      .join(', ') || 'none';
    
    //User Variables

    const created = formatDate(member.createdAt);

    const embed = new RichEmbed()
      .setFooter(member.displayName, member.user.displayAvatarURL)
      .setThumbnail(member.user.displayAvatarURL)
      .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

      .addField('Member Information', stripIndents`**Display name:** ${member.displayName}
      **Joined at: **${joined}
      **Roles: **${roles}`, true)

      .addField('User Information', stripIndents`**User ID: **${member.user.id}
      **Username: **${member.user.username}
      **Discord Tag: **${member.user.tag}
      **Created at: **${created}`, true)

      .setTimestamp();

    if(member.user.presence.game)
      embed.addField('Currently playing', `**Name: **${member.user.presence.game.name}`);
    
      message.channel.send(embed);
  }
}