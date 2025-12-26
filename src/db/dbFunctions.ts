

enum DB_ERRORS {
    no_access,
    reloade_required,
    no_objectstore,
}

export interface DBDescription {

}

export function openDB(name: string, version: number, updateSchema: (db: IDBDatabase) => void): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        let db = indexedDB.open(name, version)
        db.onupgradeneeded = (event) => {
            if (event.newVersion ?? 0 > version)
            {
                console.log("Got Version ", event.newVersion,event.oldVersion)
                rej(DB_ERRORS.reloade_required)
            }
            updateSchema(db.result)
            res(db.result)
        }
        db.onsuccess = () => res(db.result)
        db.onerror=(e)=>{
            e.stopPropagation()
            console.warn('Ignore unhandled error')
        } 
    })

}

export function write<I extends DBDescription>(db: IDBDatabase, store: keyof I, ...items: I[keyof I][]): Promise<void> {
    return performReadWriteTransaction(db, store, (trans, res) => {
        let objStore = trans.objectStore(<string>store)
        trans.oncomplete = () => res()
        try{
            for (let i of items) {
                objStore.add(i)
            }
        }
        catch(e)
        {
            console.error(e)
        }

    })
}

export function update<I extends DBDescription>(db: IDBDatabase, store: keyof I, item: I[keyof I]): Promise<void> {
    return performReadWriteTransaction(db, store, (trans, res) => {
        let objStore = trans.objectStore(<string>store)
        trans.oncomplete = () => res()
        try{
          objStore.put(item)
        }
        catch(e)
        {
            console.error(e)
        }
    })
}

export function performReadWriteTransaction<I extends DBDescription, T>(db: IDBDatabase, store: keyof I, callback: (transaction: IDBTransaction, res: (value: T) => void) => void): Promise<T> {
    return new Promise((res, rej) => {
        let trans = db.transaction(<string>store, "readwrite")
        trans.onerror = (e) => {
            e.stopPropagation()
            rej(DB_ERRORS.no_objectstore)
        }
        trans.onabort = e => e.stopPropagation()
        callback(trans, res)
    })
}


export function performTransaction<I extends DBDescription, T>(db: IDBDatabase, store: keyof I, callback: (transaction: IDBTransaction, res: (value: T) => void) => void): Promise<T> {
    return new Promise((res, rej) => {
        let trans = db.transaction(<string>store, "readonly")
        trans.onerror = e => 
            {
e.stopImmediatePropagation()
                rej(DB_ERRORS.no_objectstore)
            }
        callback(trans, res)
    })
}