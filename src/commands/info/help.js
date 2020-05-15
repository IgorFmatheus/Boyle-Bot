const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags'); 

module.exports = {
  name: 'help',
  aliases: ['h'],
  category: 'info',
  description: 'Return all commands, or one specific command info',
  usafe: '[command]',
  execute: async (client, message, args) => {
    try {
      
      if(message.deletable) message.delete();
      if(args[0])
        return getCMD(client, message, args[0]);
      else 
        return getAll(client, message);
    
    } catch(err) {
      if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
    }
  },
}

function getAll (client, message) {
  const embed = new RichEmbed()
    .setColor('RANDOM');
  
  const commands = (category) => {
    return client.commands
      .filter(cmd => cmd.category === category)
      .map(cmd => `- \`${cmd.name}\``)
      .join('\n');
  }

  const info = client.categories
    .map(cat =>  stripIndents`**${cat[0].toUpperCase() + cat.slice(1) }** \n${commands(cat)}`)
    .reduce((string, category) => string + '\n' + category);

  return message.channel.send(embed.setDescription(info)).then(
    m => m.delete(30000));
}

function getCMD (client, message, input) {
  const embed = new RichEmbed();

  const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

  let info = `No information found for command **${input.toLowerCase()}**`;

  if(!cmd) {
    return message.channel.send(embed.setColor('#FF0000')
      .setDescription(info))
      .then(m => m.delete(30000))
  }

  if(cmd.name) info = `**Command Name: **${cmd.name}`;
  if(cmd.aliases) info += `\n**Aliases: **${cmd.aliases.map(a => `\`${a}\``).join(', ')}`;
  if(cmd.description) info += `\n**Description: **${cmd.description}`;
  if(cmd.usage){
    info += `\n**Usage: **${cmd.usage}`;
    embed.setFooter(`Syntaax: <> = required, [] = optional`);
  }

  return message.channel.send(embed.setColor('#00FF00')
    .setDescription(info))
    .then(m => m.delete(30000));

}