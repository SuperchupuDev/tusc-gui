import path from 'node:path';
import { run, type TuscOptions, update } from '@superchupu/tusc';
import { app, BrowserWindow, ipcMain, nativeImage, shell } from 'electron';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const ytDlpPath = path.join(__dirname, '../node_modules/@superchupu/tusc/dist/yt-dlp.exe');

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
  ipcMain.handle('tusc.run', (event: unknown, options: TuscOptions) => run({ ytDlpPath, ...options }));
  ipcMain.handle('tusc.update', () => update(ytDlpPath));
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
