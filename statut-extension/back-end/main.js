var client,dataFolder,electron
const fs = require("fs")
module.exports = {
    start(){
        console.log("b")
        client = this.client
        dataFolder = this.dataFolder
        electron = this.electron
        var configData = JSON.parse(fs.readFileSync(dataFolder+"/webpage-data/config.json","utf-8"))
        console.log(configData)

        let les_status = configData.status
        setInterval(async function()  {
        var statut = les_status[Math.floor(Math.random()*les_status.length)];
        var memberss = client.users.cache.size
        statut=statut.replace("{members}", client.users.cache.size)
        statut=statut.replace("{servers}", client.guilds.cache.size)
        console.log(statut)
        client.user.setPresence({
            activity: {
                name: `${statut}`,
            }
        })
    }, 10000)
    }
}