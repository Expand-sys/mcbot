const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { sendResponse, sendReply } = require('../../../utils/utils');
const {dbclient} = require("../../../mongo")
const path = require('path');
const { Rcon } = require("rcon-client");




module.exports = {
    name: `updateroles`,
    description: `Manually update all roles`,
    cooldown: 5,
    defaultMemberPermissions: [PermissionsBitField.Flags.BanMembers],
    type: ApplicationCommandType.ChatInput,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        let changed = []
        await interaction.deferReply()
        const collection = dbclient.db("ntcmcbot").collection("users");
        const cursor = await collection.find().forEach(async function(user){
            console.log(user.DISCORDID)
            let member = await interaction.guild.members.cache.get(user.DISCORDID)
            console.log(`checking ${member.user.username}`)
            
            let highest = "stdusr";
            switch(true) {
            case interaction.member.roles.cache.has(process.env.DISCORDSTAFF_ROLE):
                highest = "discordstaff";
                break;
            case interaction.member.roles.cache.has(process.env.MCSTAFF_ROLE):
                highest = "mcstaff";
                break;
            case interaction.member.roles.cache.has(process.env.PATREON_ROLE):
                highest = "patreon";
                break;
            case interaction.member.roles.cache.has(process.env.BOOSTER_ROLE):
                highest = "booster";
                break;
            
            }
            console.log(user.USRROLE)
            if(highest != user.USRROLE){
                collection.updateOne(
                    { DISCORDID: `${user.DISCORDID}` },   // Query parameter
                    { $set: {                     // Replacement document
                        USRROLE: `${highest}`
                    }},
                    { upsert: true }      // Options
                )
                console.log(`updated user in database to highest role`)
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
                
        
                let clear = await rcon.send(`lp user ${user.MCUSR} parent clear`)
                let res = await rcon.send(`lp user ${user.MCUSR} parent add ${highest}`);
                changed.push(`${member.user.username}(${user.MCUSER}) -> ${highest}`)
            }
        if (changed.length <= 0){
            sendResponse(interaction, `nothing to do here boss`)

        }else {
            sendResponse(interaction, `Heres what we changed boss: \n${changed}`)
        }
        })
    }
}



