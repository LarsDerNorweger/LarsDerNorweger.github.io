import { Context } from "../context"
import { DBStorageEntry, deleteItem } from "../db/storage-db"
import { addClasses, create } from "../dom"
import { showCallBack } from "../views/views"

export function renderDeleteDialog(item: DBStorageEntry, context: Context, showView: showCallBack) {
    let res = create('dialog')
    let trg = create('article', res)
    create('p', create('header', trg), `Soll der Eintrag ${item.name} mit der ID ${item.id} gelöscht werden?`)

    let btns = addClasses(create('div', trg), 'grid')
    addClasses(create('button', btns, 'Nein'), 'secondary').onclick = () => {
        res.remove()
        showView('details', true)
    }
    create('button', btns, 'Ja').onclick = () => {
        res.remove()
        context.categoryOfInterest = undefined
        deleteItem(context.database, item.id)
        showView('stats', true)
    }

    res.open = true
    return res
}

export function renderDeleteDialogSearch(item: DBStorageEntry, context: Context,handleDelete:()=>void) {
    let res = create('dialog')
    let trg = create('article', res)
    create('p', create('header', trg), `Soll der Eintrag ${item.name} mit der ID ${item.id} gelöscht werden?`)

    let btns = addClasses(create('div', trg), 'grid')
    addClasses(create('button', btns, 'Nein'), 'secondary').onclick = () => {
        res.remove()
    }
    create('button', btns, 'Ja').onclick = () => {
        res.remove()
        context.categoryOfInterest = undefined
        deleteItem(context.database, item.id)
        handleDelete()
    }

    res.open = true
    return res
}