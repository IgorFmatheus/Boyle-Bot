const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { getOperation } = require('../../functions')

module.exports = {
  name: 'roll',
  aliases: ['d'],
  category: 'fun',
  usage: '([ Multiplier ]+ < dice > + [ Operation ])',
  description: 'Roll a dice.',
  execute: async (client, message, args) => {
    let rolled = args[0];

    if (message.deletable) message.delete();
    
    if(!rolled){
      return message.reply('I need something to roll! \n choose a dice')
        .then( m => m.delete(5000));
    }

    if(!rolled.includes('d')){
      return message.reply('You have to use "d" to choose the dice. \n example: 2d20+3 , d20+3, d20').then(m => m.delete(5000));
    }

    if(!rolled.startsWith('d')){
      const multiplier = rolled.slice(0,rolled.indexOf('d'));

      rolled = rolled.slice(rolled.indexOf('d'));
      console.log(`multiplier: ${multiplier} \n rolled: ${rolled}`);
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