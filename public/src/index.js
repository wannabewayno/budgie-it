import { installServiceWorker } from '../js/installServiceWorker.js';
import { initialize, eventListeners } from '../js/index.js'


installServiceWorker();
initialize();
eventListeners();

// import * as functionBlock1 from '../js/index.js'

// for (functions in functionBlock1) {
//     functionBlock1[functions]();
// }