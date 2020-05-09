const { readdirSync } = require('fs');
const ascii = require('ascii-table');

const table = new ascii()
  .setHeading('command', 'Load Status');

module.exports = client => {
  readdirSync('./src/commands/').forEach( dir => {
    const commands = readdirSync(`./src/commands/${dir}/`)
      .filter(file => file.endsWith('.js'));

    for( let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);

      if (pull.name){
        client.commands.set(pull.name, pull);
        table.addRow(file, '✅');
      }else{
        table.addRow(file, '❌');
        continue;
      }

      if(pull.aliases && Array.isArray(pull))
        pull.aliases.forEach(alias => 
          client.aliases.set( alias, pull.name));
    }
  });

  console.log(table.toString());
}