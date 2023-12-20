const cronjob = require('cron').CronJob;
const { spawn } = require('node:child_process');
const fs = require('fs');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const dig = require("gamedig")

const path = require('path');
const { channelSend } = require('../../utils/utils');



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await dbclient.connect();
    // Send a ping to confirm a successful connection
    await dbclient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await dbclient.close();
  }
}
run().catch(console.dir);

count = 0

serverofflinefor = 0;
let restarted = 0;
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
                }).then(async (state) => {
                    //console.log(state);
                    console.log(state.players)
                    serverofflinefor = 0;
                    if(restarted == 1){
                        channelSend("Server back online!")
                    }
                    restarted = 0;
                    count +=1
                    //this will be where i do the tracking logic for how long people have been on the server
                    if(count == 6){
                        await dbclient.connect()
                        //let ping = await dbclient.db("timetracking").command({ ping: 1})
                        //console.log(ping)
                        let collection = await dbclient.db("timetracking").collection("times")
                        for(i = 0; i < state.players.length; i++){
                            const query = { name: `${state.players[i].name}`}
                            const update = { $inc: { time: 1 }}
                            const options = { upsert: true }
                            await collection.findOneAndUpdate(query, update, options)
                            console.log("butts")
                        }
                        await dbclient.close()
                        count = 0
                    }
                    
                }).catch(async (error) => {
                    console.log("Server is offline " + error);
                    serverofflinefor += 10
                    if(serverofflinefor <= 60){
                        channelSend(`Server offline for ~${serverofflinefor}`)    
                    }
                    if(serverofflinefor == 60 && restarted != 1){
                        channelSend(`Server Offline for 60 seconds Restarting`)
                        //this is commented out temporarily to stop the server trying to start on my local machine but has been tested as working
                        //const killer = await spawn("screen", ['-XS', 'minecraft', 'quit'])
                        //const mc = await spawn("screen", ['-dmS', 'minecraft', '/bin/bash', `${process.env.SERSTARTLOC}/ServerStart.sh`], {
                            //cwd: `${process.env.SERSTARTLOC}`
                        //})
                        restarted = 1
                    }
                });
                        
                    runevery30seconds(++i)
            }, 10000)
            
        }





    }
};