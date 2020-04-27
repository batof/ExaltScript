const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path');


function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('interface/index.html')
  require(`./src/core`).init()
  ipcMain.on('synchronous-message', function(event, arg) {
    let core = require(`./src/core`)
    console.log('\x1b[36m%s\x1b[0m', '==============UPDATED==============');
    core.do(arg)
    event.returnValue = 0
  });
}

app.whenReady().then(()=>{
  createWindow()
})