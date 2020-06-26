const { installServiceWorker } = require('../js/installServiceWorker.js');
const { initialize, eventListeners } = require('../js/index.js');


installServiceWorker();
initialize();
eventListeners();