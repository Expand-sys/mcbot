const cronjob = require('cron').CronJob;
const { dbclient } = require('../../mongo');
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);

const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    async execute(message, client, Discord) {

        console.log('Client is online!');
        console.timeEnd('Time to online');

        // Connect to database
        
        const checkDB = new cronjob('59 23 * * *',  async function () {
            let guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)
            const collection = dbclient.db("ntcmcbot").collection("users");
            const cursor = collection.find().forEach(async function(user){
                
                let member = guild.members.cache.get(`${user.DISCORDID}`)
                console.log(`updating ${member.name}`)
                
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
                if(highest != user.USRROLE){
                    interaction.deferReply()
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
                    
            
                    let clear = await rcon.send(`lp user ${mcusr} group remove ${user.USRROLE}`)
                    let res = await rcon.send(`lp user ${user.MCUSR} group add ${highest}`);
                }
            })
        })
    }
};