const cronjob = require('cron').CronJob;
const { spawn } = require('node:child_process');
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const dig = require("gamedig")

const path = require('path');
const { channelSend } = require('../../utils/utils');
serverofflinefor = 0;

module.exports = {
    name: 'ready',
    once: true,
    async execute(message, client, Discord) {

        console.log('Client is online!');
        console.timeEnd('Time to online');

        runevery30seconds(1)
        function runevery30seconds(i) {
            setTimeout(() => {
                
                
                
                dig.query({
                    type: 'minecraft',
                    host: process.env.MCHOST,
                    port: process.env.MCHOSTPORT,
                }).then((state) => {
                    //console.log(state);
                    //console.log(state.players)
                    serverofflinefor = 0;
                }).catch((error) => {
                    console.log("Server is offline" + error);
                    serverofflinefor += 10
                    channelSend(`Server offline for ~${serverofflinefor}`)
                    if(serverofflinefor > 60){
                        const mc = spawn("screen", ['-dmS', 'minecraft', '/bin/bash', `${process.env.SERSTARTLOC}`])
                    }
                });
                        
                    runevery30seconds(++i)
            }, 10000)
            
        }





    }
};