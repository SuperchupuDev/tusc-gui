import type { TuscOptions } from '@superchupu/tusc';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('tusc', {
  run: (options: TuscOptions) => ipcRenderer.invoke('tusc.run', options),
  update: () => ipcRenderer.invoke('tusc.update')
});

contextBridge.exposeInMainWorld('userProfile', process.env.USERPROFILE);

contextBridge.exposeInMainWorld('openExternal', (url: string) => ipcRenderer.invoke('openExternal', url));

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron'] as const) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
