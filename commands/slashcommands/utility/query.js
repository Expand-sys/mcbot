const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply, channelSend } = require('../../../utils/utils');
const path = require('path');
const { Rcon } = require("rcon-client");
const dig = require("gamedig")


module.exports = {
    name: `query`,
    description: `Fetch a the query response from server`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
      const { member, guild, options } = interaction
      await interaction.deferReply({ ephemeral: false }).catch(err => console.error(`There was a problem deferring an interaction: `, err));
      dig.query({
        type: 'minecraft',
        host: process.env.MCHOST,
        port: process.env.MCHOSTPORT,
        }).then((state) => {
            //console.log(state);
            //console.log(state.players)
            sendResponse(interaction, `${state}`)
        }).catch(async (error) => {
            console.log("Server is offline " + error);
            sendResponse(interaction, "Server is offline")
        });
    },
}