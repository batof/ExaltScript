const player = require('./player')
const rp = require('request-promise')
let localPlayer
let otherPlayers = require('./otherPlayer')
let enemies = require('./enemy')

let setup = ()=>{}
let draw = ()=>{}
let onKeyPress = ()=>{}
let onWorldChange = ()=>{}
let onLoadedWorld = ()=>{}
let memory
let handle
let entities = []

async function init(){
    let dumps
    // Offset loading
    try {
        dumps = await rp('https://raw.githubusercontent.com/DimitriCunev/ROTMG-Updated-XML/master/offsets.json');
    } catch (error) {
        console.log("Could not initate offsets, make sure you are connected to the internet")
    }
    //LocalPlayer initialization
    try {
        localPlayer = new player
    } catch (error) {
        console.log(error)
    }
    //Core initialization
    if(localPlayer.accepted!==0&&dumps){
        console.log('Successfully started Core Module')
        localPlayer.offsets = JSON.parse(dumps);
        memory = localPlayer.memoryjs
        handle = localPlayer.memory.process.handle
        initEntities()
    } else {
        console.log('Offsets were not loaded because something went wrong')
        setInterval(() => {}, 1000);
    }
}


let drawInterval,TICKS=0,TICKRATE = 100
function execCode(data){
    
    try {
        eval(data)
        setup()

        clearInterval(drawInterval)
        drawInterval = setInterval(()=>{
            TICKS+=1
            draw(TICKS)
        },1000/TICKRATE)

    } catch (error) {
        console.log(error)
    }
}

function read(offset,type){
    return (memory.readMemory(localPlayer.memory.process.handle,offset,type))
}
function write(offset,value,type){
    return (memory.writeMemory(localPlayer.memory.process.handle,offset,value,type))
}


function isPlayer(addr){
    let plAddr = read(localPlayer.memory.module.modBaseAddr+0x31F1978,'int')
    return read(addr,'pointer')==plAddr;
}

function initEntities(){
    //Writing info.
    entities = []
    var fs = require('fs');
    let playerAdress = read(localPlayer.memory.module.modBaseAddr+0x31F1978,'int')
    let enemyAdress = read(localPlayer.memory.module.modBaseAddr+0x31F1A80,'int')
    fs.writeFileSync("adresses.exd",playerAdress+':'+enemyAdress,'utf8')

    //Getting info
    var exec = require('child_process').execFile;
    exec('entityScrapper.exe', function(err, data) {  
        entitiesDemo = data.toString().split(',').map((e)=>parseInt(e))   
        entitiesDemo.forEach((e)=>{
            let lastThree = e.toString(16).slice(-3)
            //Not all adresses containing player/enemy class are safe to edit.
            if(lastThree=='540'||lastThree=='000'||lastThree=="a80"||lastThree=="320"||lastThree=="640"||lastThree=="960"||lastThree=="c80"){
                entities.push(e)
            }
        })   
        enemies.init(entities)       
        otherPlayers.init(entities)       
        console.log('Done!')
        console.log(entities.length+' entity adresses!')
    });  

}

module.exports = {init:init,do:execCode}