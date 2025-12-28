import { Context } from "../context";
import { getItemsByName } from "../db/storage-db";
import { renderDeleteDialog } from "../dialogs/removedialog";
import { addClasses, create, renderTable, renderTableRow } from "../dom";
import { showCallBack } from "./views";

export async function renderDetailsView(showView: showCallBack, context: Context): Promise<HTMLElement> {
    console.log(context)

    let main = addClasses(create('main'), 'container-fluid')
    let header = create('nav', create('header', main))
    create('h2', header, context.categoryOfInterest)
    console.log('Show detailed view for', context.categoryOfInterest)
    create('button', header, 'Zurück').onclick = () => {
        history.back()
        context.categoryOfInterest = undefined
    }
    if (!context.categoryOfInterest) {
        showView('stats', true)
        return main;
    }
    let table = addClasses(renderTable(main, 'ID', 'Erstellungsdatum'), 'striped')
    let items = await getItemsByName(context.database, context.categoryOfInterest)

    items.sort((a, b) => a.date.getTime() - b.date.getTime())

    for (let i of items) {
        renderTableRow(table, create('span', undefined, i.id + ''), create('span', undefined, i.date.toDateString())).onclick = () => document.body.append(renderDeleteDialog(i, context, showView))
    }

    return main;
}

