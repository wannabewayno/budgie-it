let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function accessDB(storeName) {
    return new Promise((resolve,reject) => {
        // create a transaction on the pending db with readwrite access
        const transaction = db.transaction([storeName], "readwrite");

        // access your pending object store
        const store = transaction.objectStore(storeName);

        resolve(store)
    });
}

function saveRecord(record) {
    return new Promise ((resolve,reject) => {
        //access the database on the 'pending' object store
        accessDB('pending')
        // add record to your store with add method.
        .then( store => resolve(store.add(record)))
    })
}

function getAllRecords() {
    return new Promise ((resolve,reject) => {
        // access db on the 'pending' object store
        accessDB('pending')
        .then(store => {
            // get all records
            const getAll = store.getAll()

            getAll.onsuccess = function (event) {
                resolve(event.target.result);
            }

            getAll.onerror = function (error) {
                reject(error)
            }
        }) 
    })
}

function clearAllRecords() {
    return new Promise((resolve,reject) => {
        //access the database on the 'pending' object store
        accessDB('pending')
        // clear the store
        .then( store => resolve(store.clear()) )
    })
}

async function checkDatabase() {
   return getAllRecords()
    .then(allRecords => {

        if (allRecords.length > 0) {
            
            return fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(allRecords),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then( response => response.json() )
            .then( () => clearAllRecords() )
        }
    })
}

