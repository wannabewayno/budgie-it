/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/index.js":
/*!****************************!*\
  !*** ./public/js/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let transactions = [];\nlet myChart;\n\nfunction initialize() {\n  fetch(\"/api/transaction\",{\n    method: 'GET', \n    mode: navigator.onLine ? 'cors' : 'same-origin', // no-cors, *cors, same-origin\n    cache: navigator.onLine ? 'reload' : 'only-if-cached', // *default, no-cache, reload, force-cache, only-if-cached\n    credentials: 'same-origin', \n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    },\n      // 'Content-Type': 'application/x-www-form-urlencoded'\n    redirect: 'follow', \n    referrerPolicy: 'no-referrer', \n  })\n  .then(response => response.json() )\n  .then(async data => {\n    // save db data on global variable\n    // if online  -> data from mongo db\n    // if offline -> cached mongo db data from the last online GET request\n    transactions = data;\n\n    if (!navigator.onLine) {\n      // if offline, retrieve offline data from indexeddb\n      return await getAllRecords()\n    }\n    \n  })\n  .then(offlineData => {\n\n    if (offlineData){\n      // merge offline data with cached data\n      transactions.unshift(...offlineData.reverse());\n    }\n\n    populateTotal();\n    populateTable();\n    populateChart();\n  })\n  .catch( error => console.log(error) )\n}\n\ninitialize();\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  let total = transactions.reduce((total, t) => {\n    return total + parseInt(t.value);\n  }, 0);\n\n  let totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  let tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n\n  transactions.forEach(transaction => {\n    // create and populate a table row\n    let tr = document.createElement(\"tr\");\n    tr.innerHTML = `\n      <td>${transaction.name}</td>\n      <td>${transaction.value}</td>\n    `;\n\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  let reversed = transactions.slice().reverse();\n  let sum = 0;\n\n  // create date labels for chart\n  let labels = reversed.map(t => {\n    let date = new Date(t.date);\n    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;\n  });\n\n  // create incremental values for chart\n  let data = reversed.map(t => {\n    sum += parseInt(t.value);\n    return sum;\n  });\n\n  // remove old chart if it exists\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  let ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n\n  myChart = new Chart(ctx, {\n    type: 'line',\n      data: {\n        labels,\n        datasets: [{\n            label: \"Total Over Time\",\n            fill: true,\n            backgroundColor: \"#6666ff\",\n            data\n        }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  let nameEl = document.querySelector(\"#t-name\");\n  let amountEl = document.querySelector(\"#t-amount\");\n  let errorEl = document.querySelector(\".form .error\");\n\n  // validate form\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  }\n  else {\n    errorEl.textContent = \"\";\n  }\n\n  // create record\n  let transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  };\n\n  // if subtracting funds, convert amount to negative number\n  if (!isAdding) {\n    transaction.value *= -1;\n  }\n\n  // add to beginning of current array of data\n  transactions.unshift(transaction);\n\n  // re-run logic to populate ui with new record\n  populateChart();\n  populateTable();\n  populateTotal();\n  \n  // also send to server\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  })\n  .then(response => {    \n    return response.json();\n  })\n  .then(data => {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    }\n    else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n    initialize();\n  })\n  .catch(err => {\n    // fetch failed, so save in indexed db\n    saveRecord(transaction);\n    initialize();\n\n    // clear form\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\nfunction eventListeners(){\n  document.querySelector(\"#add-btn\").onclick = function() {\n    sendTransaction(true);\n  };\n\n  document.querySelector(\"#sub-btn\").onclick = function() {\n    sendTransaction(false);\n  };\n\n  // listen for app coming back online\n  window.addEventListener(\"online\", () => {\n    checkDatabase()\n    .then( () => initialize() )\n\n  });\n}\n\neventListeners();\n\n\n//# sourceURL=webpack:///./public/js/index.js?");

/***/ }),

/***/ "./public/js/installServiceWorker.js":
/*!*******************************************!*\
  !*** ./public/js/installServiceWorker.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function installServiceWorker(){\r\n    if (\"serviceWorker\" in navigator) {\r\n        window.addEventListener(\"load\", () => {\r\n            navigator.serviceWorker.register(\"service-worker.js\").then(reg => {\r\n            console.log(\"We found your service worker file!\", reg);\r\n            });\r\n        });\r\n    }\r\n}\r\n\r\ninstallServiceWorker();\n\n//# sourceURL=webpack:///./public/js/installServiceWorker.js?");

/***/ }),

/***/ "./public/src/index.js":
/*!*****************************!*\
  !*** ./public/src/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_installServiceWorker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/installServiceWorker.js */ \"./public/js/installServiceWorker.js\");\n/* harmony import */ var _js_installServiceWorker_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_installServiceWorker_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js/index.js */ \"./public/js/index.js\");\n/* harmony import */ var _js_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_index_js__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\n\r\nObject(_js_installServiceWorker_js__WEBPACK_IMPORTED_MODULE_0__[\"installServiceWorker\"])();\r\nObject(_js_index_js__WEBPACK_IMPORTED_MODULE_1__[\"initialize\"])();\r\nObject(_js_index_js__WEBPACK_IMPORTED_MODULE_1__[\"eventListeners\"])();\n\n//# sourceURL=webpack:///./public/src/index.js?");

/***/ })

/******/ });