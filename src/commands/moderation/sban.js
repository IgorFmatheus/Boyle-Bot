const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { promptMessage } = require('../../functions');

module.exports = {
  name: 'sban',
  category: 'moderation',
  description: 'ban and unban a member from server',
  usage: '<id | mention>',
  execute: async (client , message, args) => {
    const logChannel = message.guild.channels.find(c => c.name === 'logs' ||c.name === 'log') || message.channel;

    if (message.deletable) message.delete();

    // No args
    if (!args[0]) {
      return message.reply('Please provide a person to Soft-ban.')
        .then(m => m.delete(5000));
    }
    
    // No reason
    if (!args[1]) {
      return message.reply('Please provide a reason to ban.')
        .then(m => m.delete(5000));
    }

    // No author permissions
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('❌ You do not have permissions to ban members. Please contact a staff member.')
        .then(m => m.delete(5000));
    }

    // No bot permissions
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
      return message.reply('❌ I do not have permissions to ban members. Please contact a staff member.')
        .then(m => m.delete(5000));
    }
    
    const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

    // No member found
    if (!toBan) {
      return message.reply("Couldn't find that member, try again")
        .then(m => m.delete(5000));
    }

    // Can't ban urself
    if (toBan.id === message.author.id) {
      return message.reply("You can't ban yourself....")
        .then(m => m.delete(5000));
    }

    // Check if the user's banable
    if (!toBan.banable) {
      return message.reply("I can't ban that person due to role hierarchy, I guess.")
        .then(m => m.delete(5000));
    }

    const embed = new RichEmbed()
      .setColor('#FF0000')
      .setThumbnail(toBan.user.displayAvatarURL)
      .setFooter(message.member.displayName, message.author.member.displayAvatarURL)
      .setTimestamp()
      .setDescription(stripIndents`**Banned member: **${toBan} (${toBan.id})
      **Banned by: **${message.member} (${message.member.id})
      **Reason: **${args.slice(1).join(' ')}`);

    const promptEmbed = new RichEmbed()
      .setColor('GREEN')
      .setAuthor('This verification becomes invalid after 30s')
      .setDescription(`Do you want to ban ${toBan}`);

    await message.channel.send(promptEmbed).then(async msg => {
      // Await the reactions and the reaction collector 
      const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌']);

      //The verification stuffs
      if (emoji === '✅'){
        msg.delete();

        toBan.ban(args.slice(1).join(' '))
          .catch(err => {
            if(err) {
              console.error(err);
              message.channel.send(`Well.... the ban didn't work out Here's the error ${err}`);
            }
          });
        
        message.guild.unban(toBan.id);

          logChannel.send(embed);
      } else if( emoji === '❌'){
        msg.delete();

        message.reply(`Ban canceled.`)
          .then( m => m.delete(10000));
      }
    });
  }
}