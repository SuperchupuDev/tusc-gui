import path from 'node:path';
import { app, BrowserWindow, ipcMain, nativeImage, shell } from 'electron';
import { run } from '@superchupu/tusc';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  const { default: fixPath } = await import('fix-path');
  fixPath();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    title: '',
    icon: nativeImage.createEmpty(),
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ipcMain.handle('tusc.run', (event: unknown, url: string | null, path: string, openExplorer: boolean) => run(url, path, openExplorer));
  ipcMain.handle('openExternal', (event: unknown, url: string) => shell.openExternal(url));
  win.loadFile('index.html')
}

app.whenReady().then(async () => {
  await createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
