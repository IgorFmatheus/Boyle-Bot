const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getMember, promptAnswer } = require('../../functions');

let roles = [];
let target;

module.exports = {
  name: 'roleadd',
  aliases: ['role'],
  category: 'moderation',
  usage: '[ mention ]',
  execute: async (client, message, args) => {
    let usableRoles;
    let roleList = '';
    let roleIndex = 1;
    let acceptableAnswers = [];

    const logChannel = message.guild.channels.find(c => c.name === 'logs' ||c.name === 'log') || message.channel;

    if(!args[0])
      usableRoles = await selfRole(message);
    else
      usableRoles = await modRole(message, args[0]);

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
          target.addRole(role.id).catch(console.error);

          const promptEmbed = new RichEmbed()
            .setColor('GREEN')
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setDescription(stripIndents`✅ Role ${role.name} added to ${target.displayName}`)
            .setThumbnail(target.user.displayAvatarURL);

          return message.reply(`✅ Role added to ${target.displayName}`).then( msg =>{
            msg.delete(5000);
            logChannel.send(promptEmbed);
          });
        }
      }

      message.reply('❌ Command canceled').then(msg => msg.delete(5000));

    });

  }
}

async function selfRole(message){
  target = await getMember(message);

  if(!target)
    return message.reply("You'v not found, try again").then(m => m.delete(5000));

  message.guild.roles.forEach( role => {
    roles.push({ name: role.name , id: role.id});
  });

  if(!roles)
      return message.reply('No role found, contact a staff member').then(m => m.delete(5000));

  let availableRoles = [];

  if(!target.hasPermission('MANAGE_ROLES')){
    availableRoles = roles.filter( role => role.name.startsWith('#'));
  }else{
    availableRoles = roles.filter(role => role !== undefined && role.name !== '@everyone' && !role.name.includes('Bot') && !role.name.includes('BOT') && !target.roles.has(role.id));
  }

  roles = [];

  return availableRoles;
}

async function modRole(message, args){
   if(!message.member.hasPermission('MANAGE_ROLES'))
     return message.reply(`You don't have permission to do this.`).then(m => m.delete(5000));

   target = await getMember(message, args);

   if(!target)
     return message.reply('Member not found, try again').then(m => m.delete(5000));

   message.guild.roles.forEach(role => {
     roles.push({name: role.name, id: role.id});
   })

   if(!roles)
     return message.reply('No role found, try again').then(m => m.delete(5000));

   const availableRoles = roles.filter(role => role !== undefined && role.name !== '@everyone' && !role.name.includes('Bot') && !role.name.includes('BOT') && !target.roles.has(role.id));
  
  return availableRoles;
}