// Save textarea text on key up and restore on render.
const Store = require('electron-store');

const store = new Store();

const saveText = event => {
	store.set('postit', event.target.value);
};

const postit = document.querySelector('textarea');
postit.addEventListener('keyup', saveText);
const savedText = store.get('postit') || '';
postit.value = savedText;
