'use babel';
import electron from 'electron';
import * as auth from './back-end/auth';
import * as api from './back-end/api';

const app = electron.app;  // Module to control application life.
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// api.user((data) => {
//   console.log(data);
// });

api.followedStreams(null, (data) => {
  console.log(data);
});

export function start() {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow = null;

  // Report crashes to our server.
  electron.crashReporter.start({
    productName: 'Twitch Viewer',
    companyName: 'thisisjimah',
    submitURL: 'http://dammitjim.co.uk/crash',
    autoSubmit: false,
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/front-end/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });

  ipcMain.on('button-pressed', auth.InitiateAuthFlow);
}
