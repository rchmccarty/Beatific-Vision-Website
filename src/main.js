// =============================================================
// EMPYREAN
// The desktop application for Beatific Vision.
// Electron Main Process
// =============================================================

const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');

const isDev = process.argv.includes('--dev');

let splashWindow = null;
let mainWindow = null;

// ---------- Splash Window ----------
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 640,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    backgroundColor: '#0A1340',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.on('closed', () => { splashWindow = null; });
}

// ---------- Main Window ----------
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0A1340',
    title: 'Empyrean',
    icon: process.platform === 'linux' ? path.join(__dirname, '..', 'build', 'icon.png') : undefined,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    // Hold splash for cinematic effect, then swap
    setTimeout(() => {
      if (splashWindow) splashWindow.close();
      mainWindow.show();
      mainWindow.focus();
    }, 1800);
  });

  // External links open in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ---------- Application Menu ----------
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: 'Empyrean',
      submenu: [
        { label: 'About Empyrean', role: 'about' },
        { type: 'separator' },
        { label: 'Hide Empyrean', accelerator: 'CmdOrCtrl+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'CmdOrCtrl+Alt+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit Empyrean', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        ...(isMac ? [] : [{ label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' }])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'togglefullscreen' },
        ...(isDev ? [{ role: 'toggleDevTools' }] : [])
      ]
    },
    {
      label: 'Window',
      role: 'windowMenu'
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Beatific Vision Website',
          click: () => shell.openExternal('https://beatificvision.com')
        },
        {
          label: 'Catholic Film Institute',
          click: () => shell.openExternal('https://catholicfilminstitute.org')
        },
        { type: 'separator' },
        {
          label: 'About Beatific Vision',
          click: () => shell.openExternal('https://beatificvision.com/about')
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ---------- IPC ----------
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:platform', () => process.platform);
ipcMain.handle('shell:openExternal', (_e, url) => shell.openExternal(url));

// ---------- App Lifecycle ----------
app.whenReady().then(() => {
  buildMenu();
  createSplashWindow();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
