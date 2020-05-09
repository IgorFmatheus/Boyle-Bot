const { Client } = require('discord.js');
const { config } = require('dotenv');

const client = new Client({
  disableEveryone: true,
});

config({
  path: __dirname + '/.env'
});

client.on('ready', () => {
  console.log(`I'm alive, my name is ${client.user.username}`);
  client.user.setActivity('Getting Developed', { type: 'Playing' });
})

client.login(process.env.TOKEN);