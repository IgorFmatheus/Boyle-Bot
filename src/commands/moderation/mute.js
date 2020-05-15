const { RichEmbed } = require('discord.js');
const { getMember, promptMessage } = require('../../functions');
const { stripIndents } = require('common-tags');

module.exports = {
  name: 'mute',
  aliase: ['silence | hush'],
  description: 'Mute a member for 2 or more minutes',
  category: 'moderation',
  usage: '<mention | time | reason>',
  execute: async (client, message, args) => {

    const logChannel = message.guild.channels.find(c => c.name === 'logs' ||c.name === 'log') || message.channel;

    const mutedRole = message.guild.roles.find( m => m.name === 'Muted');
    if(!mutedRole){

      if(!message.member.hasPermission('MANAGE_ROLES')) return message.reply(`Muted role doesn't exists, please contact a staff member`).then( m => m.delete(5000));

      if(!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply(`Mute role doesn't exists, and I don't have permission to create a new role, please contact a staff member`);
      
      const newRole = new RichEmbed()
        .setAuthor('This verification becomes invalid after 30s')
        .setDescription(`Muted role doesn't exist , do you want to create it?`);

      await message.channel.send(newRole).then(async msg => {
        const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌']);

        if(emoji === '✅'){
          try{
            const mutedRole = await message.guild.createRole({
            name: 'Muted',
            color: '#FF0000',
            permisions: [],
            position: 1,
          },
          'Create a new Muted role');

          message.guild.channels.forEach(async (channel) => {
          await channel.overwritePermissions(mutedRole, {
            SPEAK: false,
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
          });
        });

        }catch (err) {
          if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
        }

        }else if(emoji === '❌'){
          message.reply('Mute Operation stoped.').then( m => m.delete(5000));
        }
      })
    }

    if(!message.member.hasPermission('MANAGE_ROLES')) 
      return message.reply("You don't have permission to do it, contact a staff member").then( m => m.delete(5000));

    if(!message.guild.me.hasPermission('MANAGE_ROLES')) 
      return message.reply("I don't have permission to do it, contact a staff member").then( m => m.delete(5000));

    if(!args[0])
      return message.reply("I need someone to mute, try again").then( m => m.delete(5000));

    const toMute = await getMember(message, args[0]);
    
    if(!toMute)
      return message.reply('Something has gone wrong, try again.').then( m => m.delete(5000));

    if(toMute.hasPermission('MANAGE_ROLES'))
      return message.reply("I haven't permission to mute him, contact a staff member").then( m => m.delete(5000));

    if(!args[1])
      return message.reply('I have no time, no time to explain , just try again').then( m => m.delete(5000));

    if(isNaN(args[1]))
      return message.reply("That's not a valid number, try again").then(m => m.delete(5000));
    
    const time = parseInt(args[1]) * 1000;

    if(!args[2])
      return message.reply('I need a reason to do it, try again').then( m => m.delete(5000));

    const reason = args[2];

    // toMute.setMute(true, reason)
    //   .catch( err => {
    //     console.error(err);
    //     return message.reply(`Something has gone wrong, check out this ${err}.`).then(m => m.delete(5000));
    //   })
    //   .then( () => {
    //     setInterval(function (){
    //       toMute.setMute(false,)
    //         .catch( err => {
    //           console.error(err);
    //           return message.reply(`Something has gone wrong, check out this ${err}.`).then(m => m.delete(5000));
    //         })
    //     } ,time)
    //   })

    const embed = new RichEmbed()
      .setColor('#FF0000')
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setTitle(`Mute`)
      .setThumbnail(toMute.displayAvatarURL)
      .setDescription(stripIndents`**Muted: **${toMute} (${toMute.id})
      **Mute By: **${message.author} (${message.author.id})
      **Reason: **${reason}
      **Duration: **${time / 1000} seconds.`);

      try{
        await toMute.addRole(mutedRole.id);
      }catch(err) {
        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
      }
      
      logChannel.send(embed);

      setTimeout(function () {
        toMute.removeRole(mutedRole.id);
        message.reply(`<@${toMute.id}> has been unmuted!`);
      },time);
  
  }
}