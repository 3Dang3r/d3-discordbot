const fs = require('fs');
const {Collection,Client,GatewayIntentBits,ActivityType, EmbedBuilder} = require('discord.js');
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
  ],
});
client.activeGiveaways = new Collection();
client.commands = new Collection();
const config = require('./config.json')

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");


(async () => {
  for (file of functions) {
      require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(config.token)
})();

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
      const handler = require('../src/events/s'); 
      await handler.handleInteraction(interaction);
  }
});
