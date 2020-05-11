const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getOperation } = require('../../functions')

module.exports = {
  name: 'roll',
  aliases: ['d'],
  category: 'fun',
  description: 'Roll a dice.',
  execute: async (client, message, args) => {
    let rolled = args[0];

    if (message.deletable) message.delete();
    
    if(!rolled){
      return message.reply('I need something to roll! \n choose a dice')
        .then( m => m.delete({ timeout: 5000 }));
    }

    if(!rolled.startsWith('d')){
      return message.reply('You have to start the dice with "d".')
        .then(m => m.delete({ timeout: 5000 }));
    }

    rolled = rolled.slice(1);

    if(!isNaN(rolled))
      rolled = Math.floor(Math.random() * parseInt(rolled)) + 1;
    else{
      rolled = await getOperation(message, rolled , ['+', '-', '*', '/']);

      if(!rolled){
        return message.reply('Something gone wrong, try again')
          .then( m => m.delete(5000));
      }
    }

    const embed = new RichEmbed()
      .setColor('RANDOM')
      .setDescription(stripIndents`**Rolled: **${args[0]}
      **Result: **${rolled}`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setTimestamp();

    message.channel.send(embed);
  }
}