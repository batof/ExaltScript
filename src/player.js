'use strict';
const memoryjs = require('memoryjs');
const memory = require('./memory');

class Player{
    constructor(){
        this.health = {}
        this.maxHealth = {}
        this.mana = {}
        this.maxMana = {}
        this.playerX = {}
        this.playerY = {}
        this.cameraX = {}
        this.cameraY = {}
        this.playerAngle = {}
        this.model = {}
        this.virtualModel = {}
        this.renderAngle = {}
        this.address
        this.memory = memory
        this.memoryjs = memoryjs
        this.init()
    }
    find(){
        this.address = undefined
        this.offsets.player.forEach((e,i)=>{
            if (i===0){
                this.address = memoryjs.readMemory(memory.process.handle, memory.module.modBaseAddr+e.addr, e.type)
            } else {
                this.address = this.address = memoryjs.readMemory(memory.process.handle, this.address + e.addr , e.type)
            }
        })
        
    }

    init(){
        if(memory.init()){
            this.accepted = 1;
            this.health.offset = 0x1C0
            this.maxHealth.offset = 0x1BC
            this.mana.offset = 0x0
            this.maxMana.offset = 0x0
            this.playerX.offset = 0x3c
            this.playerY.offset = 0x40
            this.cameraX.offset =0x60
            this.cameraY.offset = 0x64
            this.playerAngle.offset = 0x0
            this.model.offset = 0x30
            this.virtualModel.offset = 0x18c
            this.renderAngle.offset = 0xdc

            //writes
            this.health.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.health.offset,val,'int')}
            this.maxHealth.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.maxHealth.offset,val,'int')} 
            this.playerX.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.playerX.offset,val,'float')}
            this.playerY.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.playerY.offset,val,'float')}
            this.cameraX.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.cameraX.offset,val,'float')}
            this.cameraY.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.cameraY.offset,val,'float')}
            this.model.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.model.offset,val,'int')}
            this.virtualModel.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.virtualModel.offset,val,'int')}
            this.renderAngle.write = (val)=>{memoryjs.writeMemory(memory.process.handle,this.address+this.renderAngle.offset,val,'int')}
            //particular updates
            this.health.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.health.offset , "int")}
            this.maxHealth.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.maxHealth.offset , "int")} 
            this.playerX.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.playerX.offset , "float")}
            this.playerY.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.playerY.offset , "float");}
            this.cameraX.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.cameraX.offset , "float");}
            this.cameraY.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.cameraY.offset , "float");}
            this.model.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.model.offset , "int");}
            this.virtualModel.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.virtualModel.offset , "int");}
            this.renderAngle.read = ()=>{return memoryjs.readMemory(memory.process.handle, this.address + this.renderAngle.offset , "float");}
        } else {
            console.log('Player Module could not be initiated because: no memory to read')
            this.accepted = 0
        }
        
    }
}



module.exports = Player