console.time('Time to online');
require("dotenv").config();
const Discord = require("discord.js");
const { dbclient } = require("./mongo");
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers], partials: [Discord.Partials.Channel] });

require('console-stamp')(console, {
    format: ':date(dd mmmm yyyy HH:MM:ss) :label'
});

client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

process.on('SIGINT', (code) => {
    dbclient.close()
    
    console.log("DB closed Terminating")
    process.exit()
});




client.login(process.env.BOT_TOKEN);