import { installServiceWorker } from '../js/installServiceWorker.js';
import { initialize, eventListeners } from '../js/index.js';

installServiceWorker();
initialize();
eventListeners();