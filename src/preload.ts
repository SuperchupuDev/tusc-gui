import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('tusc', {
  run: (url: string | null, path: string, openExplorer: boolean) => ipcRenderer.invoke('tusc.run', url, path, openExplorer)
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
