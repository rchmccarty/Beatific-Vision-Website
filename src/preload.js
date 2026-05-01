// =============================================================
// EMPYREAN · Preload Script
// Bridges main and renderer with contextIsolation enforced.
// =============================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('empyrean', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  getPlatform: () => ipcRenderer.invoke('app:platform'),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url)
});
