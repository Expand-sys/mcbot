const fs = require("fs");
const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse } = require('../../../utils/utils');
const { Rcon } = require("rcon-client");
const { spawn } = require("child_process");


module.exports = {
  name: `mcsay`,
  description: `run mc command on server`,
  cooldown: 5,
  defaultMemberPermissions: ['ModerateMembers'],
  type: ApplicationCommandType.ChatInput,
  options: [{
    name: `say`,
    description: `speak to them jimmy`,
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  /**
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const { member, guild, options } = interaction
    await interaction.deferReply({ ephemeral: true }).catch(err => console.error(`There was a problem deferring an interaction: `, err));
    const rcon = new Rcon({
      host: `${process.env.MCHOST}`,
      port: parseInt(process.env.RCON_PORT),
      password: `${process.env.RCON_PASS}`,
    });
    let connected = true
    

    let content = options.getString("say")
    command =`say ${member.user.username}: ${content} `;
    try{
      await rcon.connect();
    } catch(e){
      console.log(e)
      connected = false
      sendResponse(interaction, `error sending message: ${e}`);
    }
    let res = await rcon.send(`${command}`);
      rcon.end();
      sendResponse(interaction, `Sent Message: ${content}`);
  },
};
