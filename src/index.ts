import path from 'node:path';
import { run, type TuscOptions, update } from '@superchupu/tusc';
import { app, BrowserWindow, ipcMain, nativeImage, shell } from 'electron';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | null;
declare const MAIN_WINDOW_VITE_NAME: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const ytDlp = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = app.isPackaged
  ? path.join(process.resourcesPath, `./${ytDlp}`)
  : path.join(__dirname, `../../node_modules/@superchupu/tusc/dist/${ytDlp}`);

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    title: '',
    backgroundColor: '#000000',
    icon: nativeImage.createEmpty(),
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  ipcMain.handle('tusc.run', (event: unknown, options: TuscOptions) =>
    run({
      ytDlpPath,
      additionalFlags:
        process.platform === 'darwin' && !options.additionalFlags
          ? ['--ffmpeg-location', '/usr/local/bin/ffmpeg']
          : options.additionalFlags ?? [],
      onData: data => {
        mainWindow.webContents.send('tuscData', data);
      },
      onErrorData: data => {
        mainWindow.webContents.send('tuscErrorData', data);
      },
      ...options
    })
  );
  ipcMain.handle('tusc.update', () => update(ytDlpPath));

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
