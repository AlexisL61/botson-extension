//Récupération de l'ipcRenderer qui permet de communiquer avec electron
var ipcRenderer = parent.ipcRenderer
//botGuilds sont les données que la page va récupérer sur le bot
var botGuilds
var configData = {}
console.log("a")
//Envoi d'une requète pour récupérer les données d'une configuration déjà sauvegardé
ipcRenderer.send("getConfigData", { "botId": parent.currentBotOpenId, "extensionId": "welcome-goodbye-extension" })
//Envoi d'une requète pour récupérer les serveurs du bot
ipcRenderer.send("getGuilds", { "botId": parent.currentBotOpenId })

//Ceci est émit lorsque les données des serveurs du bot sont récupérées
ipcRenderer.on("getGuilds", async function (event, guildsData) {
    //Si les données ont été reçues avec succès
    if (guildsData.success == true) {
        //Alors on récupère les serveurs
        botGuilds = guildsData.data
        //On change les options possibles du sélecteur de serveur par --Choisissez un serveur-- ...
        document.getElementById("serverSelect").innerHTML = `<option value="default">--Choisissez un serveur--</option>`
        for (var i in botGuilds) {
            // ...Et on change aussi les options possibles par les serveurs du bot
            document.getElementById("serverSelect").innerHTML += `<option value="` + botGuilds[i].id + `">` + botGuilds[i].name + `</option>`
            //Envoi d'une requète pour récupérer les salons du serveur correpondant
            ipcRenderer.send("getGuildChannels", { "botId": parent.currentBotOpenId, "guildId": botGuilds[i].id })
        }
    }
})
//Ceci est émit lorsque les données des salons d'un certain serveur du bot sont récupérées
ipcRenderer.on("getGuildChannels", async function(event,guildChannels){
    console.log(guildChannels)
    //Si les données ont été reçues avec succès
    if (guildChannels.success == true) {
        //On intègre dans botGuilds les données qui ont été récupérées du ipcRenderer
        botGuilds.find(guild=>guild.id == guildChannels.guildId).channels = guildChannels.data
        console.log(botGuilds)
    }
})
//Ceci est émit lorsque les données d'une config déjà sauvegardées sont récupérées
ipcRenderer.on("getConfigData", async function(event,config){
    configData = config
    console.log(configData)
})
//Ceci est émit lorsque la sauvegarde de la config a bien été sauvegardée
ipcRenderer.on("saveConfigData", async function(event,result){
    if (result.success == true){
        //On fait apparaitre le message de succès
        document.getElementById("save-config-div-result").style.display = "block"
    }
})

//Lorsque le bouton de sauvegarde est appuyé
function saveConfig(){
    var serverId = document.getElementById("serverSelect").value
    //On récupère l'id du serveur sélectionné
    if (serverId!="default"){
        //On recréé une configuration pour ce serveur
        configData[serverId] = {"welcome":{},"goodbye":{}}
        configData[serverId].welcome.channel = document.getElementById("welcomeChannelSelect").value
        configData[serverId].goodbye.channel = document.getElementById("goodbyeChannelSelect").value
        configData[serverId].welcome.message = document.getElementById("welcomeMessageInput").value
        configData[serverId].goodbye.message = document.getElementById("goodbyeMessageInput").value
        //Envoi de la configuration à électron
        ipcRenderer.send("saveConfigData",{"config":configData,"extensionId":"welcome-goodbye-extension","botId":parent.currentBotOpenId})
    }
}

//Lorsque un autre serveur est sélectionné
function serverOnChange(){
    //On récupère l'id du serveur sélectionné
    var server = document.getElementById("serverSelect").value
    //On fait disparaitre le message de sauvegarde de configuration
    document.getElementById("save-config-div-result").style.display = "none"
    //Si le serveur sélectionné est bien un serveur (et pas --Choisissez un serveur--)
    if (server!="default"){
        //On fait apparaitre le choix des salons
        document.getElementById("configMessagesArea").style.display = "block"
        //On récupère les données du serveur sélectionné
        var thisServerData = botGuilds.find(guild=>guild.id == server)
        //On initie les salons sléctionnés
        document.getElementById("welcomeChannelSelect").innerHTML = `<option value="default">Aucun salon</option>`
        document.getElementById("goodbyeChannelSelect").innerHTML = `<option value="default">Aucun salon</option>`
        //Pour chaque salon du serveur sélectionné
        for (var i in thisServerData.channels){
            //Si le salon est bien un salon textuel
            if (thisServerData.channels[i].type == "text"){
                //Ajout aux sélécteurs de salon de bienvenue et de départ
                document.getElementById("goodbyeChannelSelect").innerHTML+= `<option value="` + thisServerData.channels[i].id + `">` + thisServerData.channels[i].name + `</option>`
                document.getElementById("welcomeChannelSelect").innerHTML+= `<option value="` + thisServerData.channels[i].id + `">` + thisServerData.channels[i].name + `</option>`
            }
        }
        //On initie les messages de bienvenue et de départ
        document.getElementById("welcomeMessageInput").value = ""
        document.getElementById("goodbyeMessageInput").value = ""
        //Si un message de bienvenue est trouvé dans la configuration reçue
        if (configData[server] && configData[server].welcome){
             //Si le salon n'est pas le salon par défaut, alors changer le sélecteur de salon par le salon sauvegardé
            if (configData[server].welcome.channel != "default"){
                document.getElementById("welcomeChannelSelect").value = configData[server].welcome.channel
            }
            document.getElementById("welcomeMessageInput").value = configData[server].welcome.message
        }
        //Même chose que pour le message de bienvenue mais pour le message de départ cette fois ci
        if (configData[server] && configData[server].goodbye){
            if (configData[server].goodbye.channel != "default"){
                document.getElementById("goodbyeChannelSelect").value = configData[server].goodbye.channel
            }
            document.getElementById("goodbyeMessageInput").value = configData[server].goodbye.message
        }
    }
}
