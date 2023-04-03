import type { TuscOptions } from '@superchupu/tusc';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});

contextBridge.exposeInMainWorld('tusc', {
  run: (options: TuscOptions) => ipcRenderer.invoke('tusc.run', options),
  update: () => ipcRenderer.invoke('tusc.update')
});

contextBridge.exposeInMainWorld('on', (channel: string, listener: Function) =>
  ipcRenderer.on(channel, (event, ...args) => listener(...args))
);

contextBridge.exposeInMainWorld('off', (channel: string, listener: (...args: any[]) => void) =>
  ipcRenderer.removeListener(channel, listener)
);

contextBridge.exposeInMainWorld(
  'userProfile',
  process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
);
