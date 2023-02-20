const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply } = require('../../../utils/utils');
const path = require('path');
const { Rcon } = require("rcon-client");
const rconpass = process.env.RCONPASS;
const host = process.env.MCHOST;



module.exports = {
    name: `list`,
    description: `Fetch a the list of players on the Minecraft Server`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        console.log("test")
        console.log(host);
        const rcon = new Rcon({
          host: `${host}`,
          port: `${process.env.RCON_PORT}`,
          password: `${rconpass}`,
        });
        let connected = true
        let error
        try{
          await rcon.connect();
        } catch(e){
          console.log(e)
          connected = false
          error = e
        }
        let res = await rcon.send(`list`);
        console.log(res)
        var rep = res.replace(/§[6crf7]/g, "");
        sendReply(interaction, `${rep}`, [],[],[], false);
        rcon.end();
    }
}