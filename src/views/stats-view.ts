import { Context } from "../context";
import { getStats } from "../db/storage-db";
import { addClasses, create, renderTable, renderTableRow } from "../dom";
import { showCallBack } from "./views";

export async function renderStatsView(showView: showCallBack, context: Context): Promise<HTMLElement> {
    console.log(context)

    let main = addClasses(create('main'), 'container-fluid')
    let header = create('nav', create('header', main))
    create('h2', header, 'Übersicht')
    create('button', header, 'back').onclick = () => history.back()
    let stats = await getStats(context.database)

    let inp = create('input', main)
    inp.placeholder = 'Nach Begriff filtern'
    inp.type = 'search'
    inp.oninput = updateState
    let table = addClasses(renderTable(main, 'Name', 'Anzahl'), 'striped')

    let availableKeys = [...stats.keys()].sort()

    function updateState() {
        for (let x of table.tBodies)
            x.remove()


        let val = inp.value.toLowerCase()
        let filteredKeys = val == ''?availableKeys :availableKeys.filter(x=>
            {

                let v = x.toLowerCase()
                return v.match(`.*${val}.*`)
            }
        )

        for (let name of filteredKeys) {
            renderTableRow(table, create('span', undefined, name), create('span', undefined, `${stats.get(name)}x`)).onclick = () => {
                context.categoryOfInterest = name;
                showView('details', false)
            }
        }
    }

    console.log(stats)
    updateState()
    return main;
}