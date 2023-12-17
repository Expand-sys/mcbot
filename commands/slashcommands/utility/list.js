const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply, channelSend } = require('../../../utils/utils');
const path = require('path');
const { Rcon } = require("rcon-client");



module.exports = {
    name: `list`,
    description: `Fetch a the list of players on the Minecraft Server`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
      const { member, guild, options } = interaction
      await interaction.deferReply({ ephemeral: false }).catch(err => console.error(`There was a problem deferring an interaction: `, err));
      const rcon = new Rcon({
        host: `${process.env.MCHOST}`,
        port: parseInt(process.env.RCON_PORT),
        password: `${process.env.RCON_PASS}`,
      });
      let connected = true
      
      try{
        await rcon.connect();
      } catch(e){
        console.log(e)
        connected = false
        sendResponse(interaction, `error sending command: ${e}`);
      }
      let res = await rcon.send(`list`);
      rcon.end();
      sendResponse(interaction, `${res}`);
    },
}