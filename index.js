const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');

//Client init

const client = new Client({
  disableEveryone: true,
});

//Instencing collection to client

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync('./src/commands/');

//pulling dommands to client

['command'].forEach(handler => {
  require(`./src/handler/${handler}`)(client);
});

//config setup

config({
  path: __dirname + '/src/.env'
});

//import prefix from precess '.env' file

const prefix = process.env.PREFIX;

//Bot starts event

client.on('ready', () => {
  console.log(`I'm alive, my name is ${client.user.username}`);
  
  //Activity setup
  
  client.user.setActivity(';help', { type: 'Playing' });
})

//Message event

client.on('message', async message => {
  
  //Message validation

  if(message.author.bot) return;
  if(!message.guild) return;
  if(!message.content.startsWith(prefix)) return;
  if(!message.member) message.member = await message.guild.fetchMember(message);

  //Handling message data

  const args = message.content.slice(prefix.length).split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if(cmd.length === 0) return;

  //Pulling command from Command Collection

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  //Command exec

  if(command)
    command.execute(client, message, args);
})

client.login(process.env.TOKEN);