import { Context } from "../context";
import { getItemById } from "../db/storage-db";
import { renderDeleteDialogSearch } from "../dialogs/removedialog";
import { addClasses, create } from "../dom";

export async function renderSearchView(context:Context):Promise<HTMLElement>
{
    console.log(context)

    let main =  addClasses( create('main'),'container')
    let header = create('nav', create('header', main))
    create('h2',header, 'Suche')
    create('button',header, 'back').onclick = ()=> history.back()
    let inp = create('input',main)
    inp.placeholder = 'Nach ID suchen'
    inp.type = 'search'

    let result = await renderSearchResult(context,inp.value,()=>inp.value = '')
    main.append(result)

    inp.oninput = updateState

    async function updateState() {        
        result.remove();
        result = await renderSearchResult(context,inp.value,()=>{
            inp.value = ''
            updateState()
        }
    )
        main.append(result)
    }
    return main;
}


async function  renderSearchResult(context:Context,idAsString:string,handleDelete:()=>void)
{
    let id = NaN
    try{
        id = Number.parseInt(idAsString)
    }
    catch(e)
    {
console.error(e)
        // Nothing to do
    }

    if(isNaN(id))
        return create('h5', undefined,'ID zur Suche eingeben')

    let item = await getItemById(context.database,id)
    if(!item)
        return create('h3', undefined,`Es liegt kein Eintrag mit der ID ${id} vor`)

    let trg = create('div')
    renderPair('Name:',item.name,trg)

    renderPair('Id:',item.id+'',trg)
    renderPair('Erstellungsdatum:',item.date.toDateString(),trg)

    create('button',trg,'Entfernen').onclick=()=> document.body.append(renderDeleteDialogSearch(item,context,handleDelete))

    return trg
}

function renderPair(key:string, value:string,target:HTMLElement){
    let trg = addClasses(create('div',target),'grid')
    create('strong',create('strong',trg),key)
    create('span',trg,value)
    return trg
}