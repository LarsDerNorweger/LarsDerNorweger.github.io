import { Context } from "../context";
import { update, write } from "../db/dbFunctions";
import { DBStorageEntry, getItemById, STORAGE } from "../db/storage-db";
import { addClasses, clear, create } from "../dom";
import { showCallBack } from "./views";

export function renderEditView(showView: showCallBack, context: Context): HTMLElement {
    let main = addClasses(create('main', document.body), 'container')
    let header = addClasses(create('header', main), 'container')
    create('h2', header, 'Neuer Gegenstand')
    main.appendChild(renderInputForm(showView, context))
    return main;
}

function renderInputForm(showView: showCallBack, context: Context) {
    let form = create('form')
    let trg = create('fieldset', form)
    let name = create('input', create('label', trg, 'Gegenstand'))
    name.oninput = updateState

    let id = create('input', create('label', trg, 'Nummer'))
    id.type = 'number'
    id.oninput = updateState

    let date = create('input', create('label', trg, 'Produktionsdatum'))
    date.type = 'date'
    date.valueAsDate = new Date()
    date.oninput = updateState

    let btns = addClasses(create('fieldset', form), 'grid')

    let cancle = addClasses(create('button', btns, 'Abbrechen'), 'secondary')
    cancle.onclick = () => showView('main')

    let btn = create('button', btns, "Hinzufügen")

    btn.onclick = async (e) => {
        e.preventDefault()
        await writeElement({
            date: date.valueAsDate ?? new Date(),
            id: id.valueAsNumber,
            name: name.value
        }, context, showView)

    }

    updateState()
    function updateState() {
        btn.disabled = (id.value == '' || date.value == '' || name.value == '')
        cancle.disabled = id.value != '' || name.value != ''
    }

    return form;
}

async function writeElement(element: DBStorageEntry, context: Context, showView: showCallBack) {
        let x = await getItemById(context.database, element.id);
        if(x)
        {
            document.body.append(renderReplaceDiaog(x,element,context,showView))
        }
        else{
            await write<STORAGE>(context.database, 'items', element)
            showView('main')
            return;
        }
}

function renderReplaceDiaog(current:DBStorageEntry, replace: DBStorageEntry,context:Context,showView: showCallBack){
    let res = create('dialog')
    let trg = create('article',res)
    create('p',create('header',trg),`Der Eintrag mit der Nummer ${current.id} existiert bereits`)
    create('p',trg, `Soll ${current.name} durch ${replace.name} erstetzt werden?`)
    
    let btns = addClasses(create('div',trg),'grid')
    addClasses(create('button',btns,'Nein'),'secondary').onclick = ()=>{
        res.remove()
        showView('edit')
    }
    create('button',btns,'Ja').onclick = ()=>{
        res.remove()
        showView('main')
        update<STORAGE>(context.database,'items',replace)
    }

    res.open = true
    return res
}