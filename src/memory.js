const memoryjs = require('memoryjs');
const processName = "RotMG Exalt.exe";
let proces,clientModule



let Mem = {}

Mem.init = ()=>{
    try {
        proces = memoryjs.openProcess(processName);
        clientModule = memoryjs.findModule("GameAssembly.dll", proces.th32ProcessID);
        Mem.module = clientModule
        Mem.process = proces
        return 1
    } catch (error) {
        
        console.log('Process Module could not be inititated because: '+error)
        return 0
    }
}



Mem.read = (offset,type)=>{
    return memoryjs.readMemory(proces.handle,offset,type)
}
Mem.write = (offset,value,type)=>{
    return memoryjs.writeMemory(proces.handle,offset,value,type)
}
module.exports = Mem
