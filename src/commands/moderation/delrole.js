const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getRoles, promptAnswer, getMember } = require('../../functions');

let roles = [];
let target;

module.exports = {
  name: 'delrole',
  aliases: ['role'],
  category: 'moderation',
  usage: '[ mention ]',
  execute: async (client, message, args) => {
    let target;
    let roleList = '';
    let roleIndex = 1;
    let acceptableAnswers = [];

    if(!message.member.hasPermission('MANAGE_ROLES'))
      return message.reply(`You don't have permission to use this command, contact a staff member.`)

    if(!args[0])
      target = await getMember(message);
    else
      target = await getMember(message, args[0]);

    if(!target)
      return message.reply('Member not found, try again').then(m => m.delete(5000));

    const usableRoles = await getRoles(message, target);

    if(!usableRoles)
      return message.reply(`Something gone wrong, try again`).then(m => m.delete(5000));

    for(let role of usableRoles){
      role.index = roleIndex;
      acceptableAnswers.push(`${roleIndex}`);
      roleIndex++;
  
      roleList += `\n ${role.index} - ${role.name} (<@&${role.id}>).`;
    }

    acceptableAnswers.push('0','c');
    roleList += `\n 0 or c to cancel`;

    const embed = new RichEmbed()
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setDescription(stripIndents`Roles \n${roleList}`);

    message.channel.send(embed).then(async m => {
      const answer = await promptAnswer (message, message.author, 30, acceptableAnswers);
    
      if(!answer)
        return m.reply('Timeout, try again').then(msg => {msg.delete(5000); m.delete(5000)})

      message.delete();
      m.delete();

      for(const role of usableRoles){

        if(answer === `${role.index}`){
          target.removeRole(role.id).catch(console.error);

          const promptEmbed = new RichEmbed()
            .setColor('GREEN')
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription(stripIndents`✅ Role ${role.name} removed from ${target.displayName}`)
            .setThumbnail(target.user.displayAvatarURL);

          return message.reply(`✅ Role Removed from ${target.displayName}`).then( msg =>{
            msg.delete(5000);
            logChannel.send(promptEmbed);
          });
        }
      }

      message.reply('❌ Command canceled').then(msg => msg.delete(5000));

    });
  }
}