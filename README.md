# ExaltScript
Project dedicated to hacking and scripting RotMG Exalt

Source code of the entity scrapper will not be posted , but it's explained how it works below


Tutorials posted by me on mpgh
In order to get player data from the exalt client, you should inject and read memory from the module GameAssemly.dll.
You can get the pointer path to localplayer adress via simple cheat-engine pointer scan.

0x150 player moving/shooting angle
0x154 player shooting angle
0x444 or 0x464 x coordinate
0x448 or 0x468 y coordinate
0x434 hp pots
0x438 mp pots
0x1C0 hp
0x1BC max hp
0x3FC xp
0x400 max xp
0x418 max mp
0x3C8 def
0x374 wis
0x22C acceleration
0x5C cameraRotation
0x364 attack
0x374 wisdom 
0x3C8 defense
0x428 stars

Here's my code using memoryjs ( because im really used to nodejs )
Initialization , find the game and find module.
```
const memoryjs = require('memoryjs');
const processName = "RotMG Exalt.exe";
const process = memoryjs.openProcess(processName);
const clientModule = memoryjs.findModule("GameAssembly.dll", process.th32ProcessID);
```
Get localplayer address
Example , first pointer from that list
Code:
```
p1 =  memoryjs.readMemory(memory.process.handle, memory.module.modBaseAddr+0x0323CFC0, pointer)  //"GameAssembly.dll"+0323CFC0
p2 =  memoryjs.readMemory(memory.process.handle, p1+0xB8, pointer)  // +0xB8
p3 =  memoryjs.readMemory(memory.process.handle, p2+0x0, pointer)  // +0x0
p4 =  memoryjs.readMemory(memory.process.handle, p3+0x90, pointer)  // +0x90
playerAddress =  memoryjs.readMemory(memory.process.handle, p4+0x240, pointer)  // +0x240

In C++

DWORD64 m_nGameAssemblyModule = (DWORD64)GetModuleHandleA("GameAssembly.dll");
void* p1 = *(void**)(m_nGameAssemblyModule +0x0323CFC0);
void* p2 = *(void**)(DWORD64(p1) + 0xB8);
void* p3 = *(void**)(DWORD64(p2) + 0x0);
```

To get player hp for example :


Code:
```
playerHealth =  memoryjs.readMemory(memory.process.handle, playerAddress+0x1C0, int)
and so on ..
```


Getting entities is a bit harder , but here's how to scrape them

First of all , i should mention that this method is pretty rough and you will be better doing it internally and hooking the mapUpdate function that @Azuki found.

Here's how i get entities externally , without injecting anything into the game -
After some cheat engine scans i noticed that each player/enemy entity adress points to another adress ( which i think is their class or something ) , which in the current update is located at: (will definitely change)
Each player address points to GameAssembly.dll+0x31F1978
Each enemy address points to GameAssembly.dll+0x31F1A80

After seeing how game handles entities , i noticed that there is a pre-defined amount of addresses dedicated to players and entities , and f.e , when one entity is not visible , the adress will be used by another entity and so on.

And , as crazy as it seems , a simple scan of addresses that point to GameAssembly.dll+0x31F1A80 inside the game memory ,will reveal all addresses dedicated to enemies, that you can loop over and check if active.

There are tons of libraries that can help you scan memory for addresses based on their values.

Respectively , here is the code that i do at the start of the game (nodejs):

```
var memscan = require("memscan");

var players = process.scanForInt32(playerClassAdress);
var enemies = process.scanForInt32(enemyClassAdress);
```
The only issue is that , not all the found adresses are safe to read or write to and there should be a bit of filtering:
For players , all the adresses should be divisible by 0x1000 or 0x540 or 0xa80 ( or end with 000, 540, a80 ).
For enemies , all the adresses should be divisible by 0x1000 or 0x320 or 0x640 or 0x960 or 0xC80

This should be easy to do , just check modulus and push to new array the filtered enemies or players.


The next thing is to handle the entities , thanks a lot to @Azuki and especially to @DIA4A for helping and posting quality stuff.

Entity is on-screen and alive - entityAdress + 0x58 (bool)
Entity x position - entityAdress + 0x3C (float)
Entity y position - entityAdress + 0x40 (float)
Entity health - entityAdress + 0x1C0 (int)

I'm not really experienced in game-hacking and im doing it for fun , hope this helps someone.
