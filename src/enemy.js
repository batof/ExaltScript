'use strict';
const memoryjs = require('memoryjs');
const memory = require('./memory');

var enemies = {}

enemies.list = []
enemies.activeList = []

enemies.init = (arr)=>{
    arr.forEach(e => {
        if(memory.read(e+0xb4,'int')==7){
            enemies.list.push(new enemy(e))
        }
    });
}

enemies.forEachActive = (funct)=>{
    enemies.list.forEach((e)=>{
        if (e.read.active()){
            funct(e)
        }
    })
}

class enemy {
    constructor(addr){
        this.addr = addr
        this.read ={}
        this.write ={}
        this.init()
    }
    init(){
        this.read.health = ()=>{return memory.read(this.addr+0x1C0,'int')} 
        this.read.x = ()=>{return memory.read(this.addr+0x3C,'float')}  
        this.read.y = ()=>{return memory.read(this.addr+0x40,'float')}  
        this.read.active = ()=>{return memory.read(this.addr+0x58,'bool')}  
        this.read.offset = (offset,type)=>{return memory.read(this.addr+offset,type)}  

        this.write.health = (value)=>{return memory.write(this.addr+0x1C0,value,'int')} 
        this.write.x = (value)=>{return memory.write(this.addr+0x3C,value,'float')}  
        this.write.y = (value)=>{return memory.write(this.addr+0x40,value,'float')}  
        this.write.offset = (offset,value,type)=>{return memory.write(this.addr+offset,value,type)}  
    }
    
}


module.exports = enemies