const { Client, GatewayIntentBits, EmbedBuilder, Events, Partials } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios')

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Runs upon bot startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Initially get panel status
    getPanelStatus()
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

// Get panel status
var panelStatus = true;

function getPanelStatus(){
    axios(config.pterodactyl.url + '/api/application/nodes', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + config.pterodactyl.apiKey
        }
    }).then(() => {
        if(panelStatus == false){
            sendEmbed('Panel', true);
        }
        console.log('panel online');
        panelStatus = true;
    }).catch(() => {
        if(panelStatus == true){
            sendEmbed('Panel', false);
        }
        console.log('panel offline');
        panelStatus = false;
    });
}

// Function to send the message embed
function sendEmbed(itemName, status){
    const channel = client.channels.cache.get(config.discordServer.channelID);
  
    if (channel){
        const statusText = status ? 'online' : 'offline';
        var embed = new EmbedBuilder()
            .setTitle(config.statusMessage[statusText].title.replace(/{name}/g, itemName))
            .setDescription(config.statusMessage[statusText].description.replace(/{name}/g, itemName))
            .setFooter({ text: config.statusMessage[statusText].footer.replace(/{name}/g, itemName) })
            .setColor(config.statusMessage[statusText].colour);
            // .setImage(config.statusMessage[statusText].image)
            // .setThumbnail(config.statusMessage[statusText].image);

        if(config.statusMessage[statusText].thumbnail){
            embed.setTimestamp();
        }
  
        channel.send({ embeds: [embed] });
    }
}

// Start the discord bot
client.login(config.discordBot.token);