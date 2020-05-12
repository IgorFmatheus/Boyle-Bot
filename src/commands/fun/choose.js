module.exports = { 
  name: 'choose',
  aliases: ['c'],
  category: 'fun',
  description: 'Choose an option between the args',
  usage: '<option | option>',
  execute: (client, message, args) => {
    if(message.deletable) message.delete();

  }
}