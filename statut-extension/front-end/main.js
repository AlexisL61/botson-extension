var ipcRenderer = parent.ipcRenderer
var botGuilds
var configData = 
console.log("a")
ipcRenderer.send("getConfigData", { "botId": parent.currentBotOpenId, "extensionId": "statut-extension" })
ipcRenderer.send("getGuilds", { "botId": parent.currentBotOpenId })
ipcRenderer.on("getGuilds", async function (event, guildsData) {
    if (guildsData.success == true) {
        botGuilds = guildsData.data

    }
})

ipcRenderer.on("getConfigData", async function(event,config){
    configData = config
    console.log(configData)
    
document.getElementById("statusTextInput1").value = ""
document.getElementById("statusTextInput2").value = ""
document.getElementById("statusTextInput3").value = ""
document.getElementById("statusTextInput4").value = ""
if (configData.status[0]){
        document.getElementById("statusTextInput1").value = configData.status[0]
}
if (configData.status[1]){
    document.getElementById("statusTextInput2").value = configData.status[1]
}

if (configData.status[2]){
    document.getElementById("statusTextInput3").value = configData.status[2]
}

if (configData.status[3]){
    document.getElementById("statusTextInput4").value = configData.status[3]
}


})

ipcRenderer.on("saveConfigData", async function(event,result){
    if (result.success == true){
        document.getElementById("save-config-div-result").style.display = "block"
    }
})

function saveConfig(){
        configData = {"status":[]}
        configData.status.push(document.getElementById("statusTextInput1").value)
        if(document.getElementById("statusTextInput2").value !== ""){
        configData.status.push(document.getElementById("statusTextInput2").value)}
        if(document.getElementById("statusTextInput3").value !== ""){
        configData.status.push(document.getElementById("statusTextInput3").value)}
        if(document.getElementById("statusTextInput4").value !== ""){
        configData.status.push(document.getElementById("statusTextInput4").value)}
        ipcRenderer.send("saveConfigData",{"config":configData,"extensionId":"statut-extension","botId":parent.currentBotOpenId})
    
}

