import { Context } from "../context";
import { getStats } from "../db/storage-db";
import { addClasses, create, renderTable, renderTableRow } from "../dom";
import { showCallBack } from "./views";

export async function renderStatsView( showView:showCallBack,context:Context):Promise<HTMLElement>
{
    console.log(context)

    let main =  addClasses( create('main'),'container')
    let header = addClasses(create('header',main))
    create('h2',header,'Übersicht')
    create('button',header, 'back').onclick = ()=> showView('main')
    let stats = await getStats(context.database)

    let table = renderTable(main,'Name','Anzahl')
    for(let name of stats.keys())
    {
        renderTableRow(table,create('span',undefined,name),create('span',undefined,`${stats.get(name)}x`)).onclick = ()=>{
            context.categoryOfInterest = name;
            showView('details')
        }
    }

    console.log(stats)
    return main;
}