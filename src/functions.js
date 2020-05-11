module.exports = {
  getMember: function(message, toFind = '') {
    toFind = toFind.toLowerCase();

    let target = message.guild.members.get(toFind);
    
    if (!target && message.mentions.members)
        target = message.mentions.members.first();

    if (!target && toFind) {
        target = message.guild.members.find(member => {
            return member.displayName.toLowerCase().includes(toFind) ||
            member.user.tag.toLowerCase().includes(toFind)
        });
    }
        
    if (!target) 
        target = message.member;
        
    return target;
  },

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date);
  },

  promptMessage: async (message, author, time, validReactions) => {
    time *= 1000;

    for( const reaction of validReactions)
      await message.react(reaction);

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max: 1, time: time })
      .then(collected => collected.first() && collected.first()
      .emoji.name );
  },

  getOperation: async function (message, arg, operators) {
    for(const operator of operators){
      if(arg.includes(operator)){
        const value = parseInt(arg.slice(arg.indexOf(operator) + 1));
        arg = arg.slice(0, arg.indexOf(operator));
        
        if(isNaN(arg)) {
          message.reply('Something gone wrong, try again.')
            .then( m => m.delete({ timeout: 5000 }));
        }
        arg = Math.floor(Math.random() * parseInt(arg)) + 1;

        if(operator === '+') arg = parseInt(arg) + value;
        if(operator === '-') arg = parseInt(arg) - value;
        if(operator === '*') arg = parseInt(arg) * value;
        if(operator === '/') arg = parseInt(arg) / value;
      
        return arg;
      }
    }
  }
}