const { Client, GatewayIntentBits, EmbedBuilder, Events, Partials } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Runs upon bot startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Get the configuration file
var config;
try {
    // Read the YAML configuration file
    const configFile = fs.readFileSync('./configuration.yml', 'utf8');

    // Parse the YAML content
    config = yaml.load(configFile);
} catch (e) {
    console.error('Error reading or parsing the configuration file:', e);
    process.exit()
}

// Start the discord bot
client.login(config.discordBot.token);