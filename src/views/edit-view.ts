import { Context } from "../context";
import { update, write } from "../db/dbFunctions";
import { DBStorageEntry, getAvailabelKeys, getItemById, getNextID, STORAGE } from "../db/storage-db";
import { addClasses, clear, create } from "../dom";
import { showCallBack } from "./views";

import './edit-view.scss'

export async function renderEditView(showView: showCallBack, context: Context): Promise<HTMLElement> {
    let main = addClasses(create('main', document.body), 'container-fluid')
    let header = addClasses(create('header', main), 'container')
    create('h2', header, 'Neuer Gegenstand')
    main.appendChild(await renderInputForm(showView, context))
    return main;
}

async function renderInputForm(showView: showCallBack, context: Context) {
    
    let form = create('form')
    let trg = create('fieldset', form)
    let name = create('input', create('label', trg, 'Gegenstand'))
    name.oninput = updateState
    trg.append( await renderAutoCompleteField(context,name))


    let id = create('input', create('label', trg, 'Nummer'))
    id.type = 'number'
    id.oninput = updateState

    create('button',trg,'ID generieren').onclick = async e=> {
        e.preventDefault()
        let nextId = await getNextID(context.database)
        console.log('Get next free Id: ',nextId)
        id.valueAsNumber = nextId
        updateState()
    }

    let date = create('input', create('label', trg, 'Produktionsdatum'))
    date.type = 'date'
    date.valueAsDate = new Date()
    date.oninput = updateState

    let btns = addClasses(create('fieldset', form), 'grid')

    let cancle = addClasses(create('button', btns, 'Abbrechen'), 'secondary')
    cancle.onclick = e => {
        e.preventDefault()
        history.back()
    }

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
    }

    
    async function renderAutoCompleteField(context:Context, input:HTMLInputElement)
    {
        let availableKeys = Array.from(await getAvailabelKeys(context.database)).sort()
        let res = addClasses(create('fieldset'),'autocomplete-container')
        input.oninput = handleChange
    
        function handleChange(){
            clear(res)
            let val = input.value.toLowerCase()
            let filteredKeys = val == ''?availableKeys :availableKeys.filter(x=>
                {
    
                    let v = x.toLowerCase()
                    return v.match(`.*${val}.*`)
                }
            )
            for(let key of filteredKeys)
            {
                addClasses(create('button',res,key),'outline','secondary').onclick = e =>{
                    e.preventDefault()
                    input.value = key
                    updateState()
                    handleChange()
                }        
            }
        }
        handleChange()
        return res
    }
    return form;
}

async function writeElement(element: DBStorageEntry, context: Context, showView: showCallBack) {
        let x = await getItemById(context.database, element.id);
        if(x)
        {
            document.body.append(renderReplaceDialog(x,element,context,showView))
        }
        else{
            await write<STORAGE>(context.database, 'items', element)
            showView('main',true)
            return;
        }
}

function renderReplaceDialog(current:DBStorageEntry, replace: DBStorageEntry,context:Context,showView: showCallBack){
    let res = create('dialog')
    let trg = create('article',res)
    create('p',create('header',trg),`Der Eintrag mit der Nummer ${current.id} existiert bereits`)
    create('p',trg, `Soll ${current.name} durch ${replace.name} erstetzt werden?`)
    
    let btns = addClasses(create('div',trg),'grid')
    addClasses(create('button',btns,'Nein'),'secondary').onclick = ()=>{
        res.remove()
        showView('edit',true)
    }
    create('button',btns,'Ja').onclick = ()=>{
        res.remove()
        showView('main',true)
        update<STORAGE>(context.database,'items',replace)
    }

    res.open = true
    return res
}