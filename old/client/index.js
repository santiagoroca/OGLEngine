// This will work in a renderer process, but be `undefined` in the
// main process:
const {app, BrowserWindow, ipcMain} = require('electron')

//
app.on('ready', () => {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 800,
    frame: true,
    resizable: false
  })

  win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('./src/index.html')

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })

})
