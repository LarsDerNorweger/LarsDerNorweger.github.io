import { Context } from "../context";
import { DBStorageEntry, deleteItem, getItemsByName } from "../db/storage-db";
import { addClasses, create, renderTable, renderTableRow } from "../dom";
import { showCallBack } from "./views";

export async function renderDetailsView( showView:showCallBack,context:Context):Promise<HTMLElement>
{
    console.log(context)

    let main =  addClasses( create('main'),'container')
    let header = create('header',main)
    create('h2',header,context.categoryOfInterest)
    console.log('Show detailed view for',context.categoryOfInterest)
    create('button',header, 'back').onclick = ()=> {
        showView('stats')
        context.categoryOfInterest = undefined
    }
    if(!context.categoryOfInterest)
    {
        showView('stats')
        return main;
    }
    let table = addClasses(renderTable(main,'ID', 'Erstellungsdatum' ),'striped')
    let items =await getItemsByName(context.database,context.categoryOfInterest)

    items.sort((a,b)=>a.date.getTime()-b.date.getTime())

    for(let i of items)
    {
        renderTableRow(table,create('span',undefined,i.id+''), create('span',undefined,i.date.toDateString())).onclick = ()=> document.body.append(renderDeleteDialog(i,context,showView))
    }

    return main;
}

function renderDeleteDialog(item:DBStorageEntry,context:Context,showView:showCallBack){
    let res = create('dialog')
    let trg = create('article',res)
    create('p',create('header',trg),`Soll der Eintrag ${item.name} mit der ID ${item.id} gelöscht werden?`)
    
    let btns = addClasses(create('div',trg),'grid')
    addClasses(create('button',btns,'Nein'),'secondary').onclick = ()=>{
        res.remove()
        showView('details')
    }
    create('button',btns,'Ja').onclick = ()=>{
        res.remove()
        context.categoryOfInterest = undefined
        deleteItem(context.database,item.id)
        showView('stats')
    }

    res.open = true
    return res
}