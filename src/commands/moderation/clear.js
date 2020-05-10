module.exports = {
  name: 'clear',
  aliases: ['purge', 'puke'],
  category: 'moderation',
  description: 'Clear the chat',
  execute: (client, message, args) => {
    if(message.deleteble) message.delete();

    if(!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.reply("You can't delete messages....")
        .then(m => m.delete(5000))
    }

    if(isNaN(args[0]) || parseInt(args[0]) <= 0) {
      return message.reply("Yeah.... That's not a number? I also can't delete 0 messages by the way.").then(m => m.delete(5000));
    }

    if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
      return message.message.reply('Sorry.... I can not delete messages.').then(m => m.delete(5000));
    }

    let deleteAmount;

    if(parseInt(args[0] > 100)){
      deleteAmount = 100;
    }else{
      deleteAmount = parseInt(args[0]);
    }

    message.channel.bulkDelete(deleteAmount, true)
      .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`))
      .catch(err => message.reply(`Something went wrong.... ${err}`));
  }
}