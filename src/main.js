// Modules to control application life and create native browser window
const {app, BrowserWindow, screen} = require('electron');
const path = require('path');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');

try {
	require('electron-reloader')(module);
} catch {}

const store = new Store();

// Add close item to the context menu
contextMenu({
	append: () => [
		{
			label: 'Close Post-it',
			visible: true,
			click: () => {
				app.quit();
			}
		}
	]
});

// Create the window to hold the note.
function createWindow() {
	const display = screen.getPrimaryDisplay();
	const screenWidth = display.bounds.width;
	const screenHeight = display.bounds.height;
	const width = 500;
	const height = 400;
	const x = screenWidth - width;
	const y = screenHeight / 2 - height / 2;
	const mainWindow = new BrowserWindow({
		width,
		height,
		x: store.get('posted-position-x') || x,
		y: store.get('posted-position-y') || y,
		acceptFirstMouse: true,
		autoHideMenuBar: true,
		resizable: true,
		transparent: true,
		frame: false,
		movable: true,
		hasShadow: false,
		alwaysOnTop: true,
		vibrancy: 'ultra-dark',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, '/index.html'));

	// Disable maximize
	mainWindow.on('maximize', () => {
		mainWindow.unmaximize();
	});

	// Save last app position before close.
	mainWindow.on('close', () => {
		const [x, y] = mainWindow.getPosition();
		store.set('posted-position-x', x);
		store.set('posted-position-y', y);
	});
}

app.whenReady().then(() => setTimeout(createWindow, 100));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
