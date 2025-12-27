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

export async function getItemsByName(db: IDBDatabase, name: string) {
    return await performTransaction<STORAGE, DBStorageEntry[]>(db, 'items', ((trans, res) => {
        let objectStore = trans.objectStore('items');
        let req = objectStore.index('name').openCursor(IDBKeyRange.only(name))
        let result: DBStorageEntry[] = []
        req.onsuccess = () => {
            let cursor = req.result
            if (cursor) {
                result.push(cursor.value)
                cursor.continue()
            }
            else
                res(result)
        }
    }))
}

export async function deleteItem(db: IDBDatabase, id: number) {
    return await performReadWriteTransaction<STORAGE, void>(db, 'items', ((trans, res) => {
        let objectStore = trans.objectStore('items');
        let req = objectStore.delete(id)
        req.onsuccess = () => res()
    }))
}

export async function getAvailabelKeys(db: IDBDatabase) {
    return await performTransaction<STORAGE, Set<string>>(db, 'items', ((trans, res) => {
        let objectStore = trans.objectStore('items');
        let req = objectStore.getAll()
        req.onsuccess = () => {
            let result = new Set<string>()
            let x = <DBStorageEntry[]>req.result
            for (let i of x) {
                result.add(i.name)
            }
            res(result)
        }
    }))
}

export async function getNextID(db:IDBDatabase){
    return await performTransaction<STORAGE,number>(db,'items',((trans,res)=>{
        let objectStore = trans.objectStore('items');
        let req = objectStore.openCursor(null,"prev")
        req.onsuccess=()=>{
            let cursor =  req.result
            if(cursor)
                res(cursor.value.id+1)
            else
                res(1)
        }
    }))
} 