import electron from 'electron';
import menubar from 'menubar';
import open from 'open';

import { initiateAuthFlow } from './api/auth';
import * as menuactions from './menu/actions';
import log from './util/logging';
import { reloadConfig, saveConfig } from './config';

// Process control
const ipcMain = electron.ipcMain;

// Create the menubar
const bar = menubar({
  index: 'file://' + __dirname + '/../front-end/main-window/index.html',
  icon: process.cwd() + '/src/front-end/icons/purple_heart.png',
  width: 320,
  height: 660,
  showDockIcon: false,
  resizable: false
  // preloadWindow: true
});


// Message sent from the renderer process to open the twitch stream in native browser
ipcMain.on('open-browser', (event, url) => {
  log.info('Opening %s in browser.', url);
  open(url);
});

ipcMain.on('view-loaded', (event) => {
  bar.window.webContents.send('loaded-followed-streams', JSON.stringify(bar.polledData));
});

// Message sent to retreive games list
ipcMain.on('get-games', (event) => {
  menuactions.getGames(bar);
});

ipcMain.on('get-channels', (event, game) => {
  menuactions.getStreams(bar, game);
});

ipcMain.on('get-followed', (event) => {
  menuactions.pollFollowed(bar);
});

ipcMain.on('save-config', (event, data) => {
  saveConfig(data);
  menuactions.getConfiguration(bar);
});

ipcMain.on('load-config', (event) => {
  menuactions.getConfiguration(bar);
});

ipcMain.on('initiate-auth', (event) => {
  initiateAuthFlow(() => {
    reloadConfig();
    menuactions.getConfiguration(bar);
  });
});

electron.app.on('ready', () => {
  // Stop polling on suspend
  electron.powerMonitor.on('suspend', () => {
    bar.continuePolling = false;
  });

  // Continue polling on resume
  electron.powerMonitor.on('resume', () => {
    bar.continuePolling = true;
  });
});

export default function() {
  bar.continuePolling = true;
  menuactions.pollFollowed(bar);
  menuactions.getGames(bar);
  menuactions.getStreams(bar);

  // This feels a bit dirty
  let conf = reloadConfig();
  let pollInterval = 'no';
  setInterval(() => {
    conf = reloadConfig();
    if (conf.enable_polling) {
      if (pollInterval === 'no') {
        log.info('Initialising followed poll');
        pollInterval = setInterval(() => {
          menuactions.pollFollowed(bar);
        }, conf.poll_interval);
      }
    } else {
      if (pollInterval !== 'no') {
        log.info('Stopping followed poll');
        clearInterval(pollInterval);
        pollInterval = 'no';
      }
    }
  }, 2000);

  bar.on('after-create-window', () => {
    menuactions.getConfiguration(bar);
    bar.window.openDevTools({ detach: true });
  });

  bar.on('after-close', () => {
    log.info('Menubar closed, recreating on next show');
  });
}
