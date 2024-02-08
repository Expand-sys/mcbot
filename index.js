console.time('Time to online');
require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers], partials: [Discord.Partials.Channel] });

//const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = `${process.env.MONGOCONN}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*const dbclient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});*/



require('console-stamp')(console, {
    format: ':date(dd mmmm yyyy HH:MM:ss) :label'
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

process.on('SIGINT', (code) => {    
    process.exit()
});


module.exports = {
    client,
    dbclient
}

client.login(process.env.BOT_TOKEN);