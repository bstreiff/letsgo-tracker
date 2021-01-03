const { app, session, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1856,
    height: 280,
    webPreferences: {
      /*contextIsolation: true,*/
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, "img", "pokedex.png")
  })

  win.loadFile('page.html')
  win.setMenuBarVisibility(false);
}

require('@electron/remote/main').initialize()

// Make for a better OBS window-capture experience.
app.disableHardwareAcceleration()

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  session.defaultSession.flushStorageData();
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
