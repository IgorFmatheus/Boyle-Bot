const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = { 
  name: 'choose',
  aliases: ['c'],
  category: 'fun',
  description: 'Choose an option between the args',
  usage: '<option | option>',
  execute: (client, message, args) => {

    if(args.length <= 2) return message.reply('I need more than 1 thing to choose between.').then(m => m.delete(5000));

    let currentOption = '';

    let options = args.map( m => {
      if(m === '|' && currentOption !== ''){
        let aux = currentOption;
        currentOption = '';
        return aux;
      }else if(m !== ','){
        currentOption += m.replace(',', '');
      }
    });

    options = options.filter( m => { return m !== undefined});

    const choosen = options[Math.floor(Math.random() * options.length)];

    const embed = new RichEmbed()
      .setColor('RANDOM')
      .setFooter(message.member.displayName, message.author.displayAvatarURL)
      .setDescription(stripIndents`**Options: **${options.join(', ')}
      **Choosen: **${choosen}`);

    message.channel.send(embed);
    if(message.deletable) message.delete();

  }
}