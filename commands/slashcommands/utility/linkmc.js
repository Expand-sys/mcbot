const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendResponse, sendReply } = require('../../../utils/utils');
const {dbclient} = require("../../../mongo")
const path = require('path');
const { Rcon } = require("rcon-client");




module.exports = {
    name: `linkmc`,
    description: `link your Discord Account to the Minecraft Server`,
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `mcusername`,
        description: `The username of the MC account you want to link`,
        type: ApplicationCommandOptionType.String,
        required: true,
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        let mcusr = interaction.options.getString("mcusername")
        let collection = await dbclient.db("ntcmcbot").collection("users");
        let userdb = await collection.findOne({DISCORDID: interaction.member.id})

        interaction.deferReply()
        let highest = "default";
        switch(true) {
        case interaction.member.roles.cache.has(process.env.MCSTAFF_ROLE):
            highest = "mcstaff";
            break;
        case interaction.member.roles.cache.has(process.env.DISCORDSTAFF_ROLE):
            highest = "discordstaff";
            break;
        case interaction.member.roles.cache.has(process.env.PATREON_ROLE):
            highest = "patreon";
            break;
        case interaction.member.roles.cache.has(process.env.BOOSTER_ROLE):
            highest = "booster";
            break;
        }

        collection = await dbclient.db("ntcmcbot").collection("users");
        // perform actions on the collection object
        collection.updateOne(
            { DISCORDID: `${interaction.member.id}` },   // Query parameter
            { $set: {                     // Replacement document
            DISCORDID: `${interaction.member.id}`,
            MCUSER: `${mcusr}`,
            USRROLE: `${highest}`
            }},
            { upsert: true }      // Options
        )
        
        const rcon = new Rcon({
            host: `${process.env.MCHOST}`,
            port: `${process.env.RCON_PORT}`,
            password: `${process.env.RCONPASS}`,
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
        console.log(userdb)
        if(userdb.USRROLE != undefined){
            let clear = await rcon.send(`lp user ${mcusr} group remove ${userdb.USRROLE}`)
        }
        let res = await rcon.send(`lp user ${mcusr} group add ${highest}`);
        console.log(res)
        await sendResponse(interaction, `added ${mcusr} to the role ${highest}`);
        await rcon.end();
    }
}



