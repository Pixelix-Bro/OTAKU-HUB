import { app, BrowserWindow, Menu } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1000,
    minHeight: 600,

    icon: path.join(__dirname, '../public/3.png'),

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Electron default menyusini olib tashlash
  Menu.setApplicationMenu(null)

  // Vite development server
  mainWindow.loadURL('http://localhost:5173')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
