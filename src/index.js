const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');


const client = new Client({
  disableEveryone: true,
});


client.commands = new Collection();
client.aliases = new Collection();

['command'].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

config({
  path: __dirname + '/.env'
});

const prefix = process.env.PREFIX;

client.on('ready', () => {
  console.log(`I'm alive, my name is ${client.user.username}`);
  client.user.setActivity('Getting Developed', { type: 'Playing' });
})

console.log(prefix);

client.on('message', async message => {
  if(message.author.bot) return;
  if(!message.guild) return;
  if(!message.content.startsWith(prefix)) return;
  if(!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if(cmd.length === 0) return;

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if(command)
    command.execute(client, message, args);
})

client.login(process.env.TOKEN);