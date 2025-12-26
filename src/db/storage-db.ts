import { DBDescription, openDB, performReadWriteTransaction, performTransaction } from "./dbFunctions";

const DB_VERSION = 1;
const DB_NAME = 'STORAGE';

export interface DBStorageEntry {
    id: number,
    name: string,
    date: Date,
}

export interface STORAGE extends DBDescription {
    items: DBStorageEntry
}

export function openStorageDB() {
    return openDB(DB_NAME, DB_VERSION, createSchema)
}

function createSchema(db: IDBDatabase) {
    let objectStore = db.createObjectStore('items', {
        keyPath: 'id'
    })
    objectStore.createIndex('name', 'name', { unique: false })
    objectStore.createIndex('date', 'date', { unique: false })
}


export async function getItemById(db: IDBDatabase, id: number): Promise<DBStorageEntry | undefined> {
    return await performTransaction<STORAGE, DBStorageEntry | undefined>(db, "items", ((trans, res) => {
        let objectStore = trans.objectStore('items')
        let req = objectStore.get(id)
        console.log("Read Item for ID", id)
        req.onerror = () => res(undefined)
        req.onsuccess = () => {
            console.log("Result:", req.result)
            res(req.result)
        }
    }))
}

export async function getStats(db: IDBDatabase) {
    return await performTransaction<STORAGE, Map<string, number>>(db, 'items', ((trans, res) => {
        let objectStore = trans.objectStore('items');
        let req = objectStore.getAll()
        req.onsuccess = () => {
            let result = new Map<string, number>()
            let x = <DBStorageEntry[]>req.result
            for (let i of x) {
                result.set(i.name, (result.get(i.name) ?? 0) + 1)
            }
            res(result)
        }
    }))
}

