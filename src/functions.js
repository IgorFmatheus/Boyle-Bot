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

  promptAnswer: async function (message, author, time, acceptableAnswers){
    time *= 1000;

    const filter = (answer) => acceptableAnswers.includes(answer.content) && answer.member.id === author.id;

    return message.channel.awaitMessages(filter, {max: 1, time: time})
      .then(msg => msg.first() && msg.first().content);
  },

  getOperation: async function (message, arg, operators, multiplier = 1) {
    let result = '';

    for(const operator of operators){
      if(arg.includes(operator)){
        const value = parseInt(arg.slice(arg.indexOf(operator) + 1));
        arg = arg.slice(0, arg.indexOf(operator));
        
        if(isNaN(arg)) {
          message.reply('Something gone wrong, try again.')
            .then( m => m.delete({ timeout: 5000 }));
        }
        for(let i = 0; i<parseInt(multiplier); i++){
          let count = Math.floor(Math.random() * parseInt(arg)) + 1;

          if(operator === '+') count = parseInt(count) + value;
          if(operator === '-') count = parseInt(count) - value;
          if(operator === '*') count = parseInt(count) * value;
          if(operator === '/') count = parseInt(count) / value;

          result += `\n ${count}`
        }
          result += `\n Operation: ${operator}${value}`;
        return result;
      }
    }
  },

  getRoles: async (message, target) => {
    let roles = [];
    
    if(!target)
      message.guild.roles.forEach( role => { roles.push({ name: role.name , id: role.id}) });
    else
      target.roles.forEach( role => { roles.push({ name: role.name, id: role.id}) });

    if(!roles || roles.length === 1)
        return message.reply('No role found, try again').then(m => m.delete(5000));
  
    let availableRoles = roles.filter(role => role !== undefined && role.name !== '@everyone' && !role.name.includes('Bot') && !role.name.includes('BOT'));

    return availableRoles;
  }

}