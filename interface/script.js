var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setFontSize("14px");
editor.setValue(localStorage['code'])
editor.clearSelection();

const {ipcRenderer} = require('electron')
ipcRenderer.on('info' , function(event , data){ console.log(data.msg) });

document.querySelector("body > button").onclick = ()=>{
    let {ipcRenderer} = require('electron');
    console.log(ipcRenderer.sendSync('synchronous-message', editor.getValue())); // prints "pong"
    localStorage['code'] = editor.getValue();
}
