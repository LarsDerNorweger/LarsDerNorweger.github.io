import { Context } from "./context";
import { getItemById, openStorageDB } from "./db/storage-db";
import { addClasses, clear, create } from "./dom"
import './main.scss'
import { renderDetailsView } from "./views/detail-view copy";
import { renderEditView } from "./views/edit-view";
import { renderMainView } from "./views/main-view";
import { renderSearchView } from "./views/search-view";
import { renderStatsView } from "./views/stats-view";
import { showCallBack, views } from "./views/views";


document.title = "VITE TEST"

let context: Context

async function main() {
    document.body.append(renderLoader())
    try {
        context = await generateContext()
        show(localStorage.getItem('ui-view') as (views | undefined) || 'main')
        let x = await getItemById(context.database, 1)
        console.log("READ", x)
    }
    catch (e) {
        console.error(e)
    }
}

let show: showCallBack = (view) => {
    let render: HTMLElement;
    console.log("Show View", view)
    clear(document.body)
    document.body.append(renderLoader())
    window.localStorage.setItem('ui-view', view)

    switch (view) {
        case "search":
            render = renderSearchView(show, context)
            break;
        case "main":
            render = renderMainView(show, context)
            break;
        case "edit":
            render = renderEditView(show, context)
            break;
        case "stats":
            render = renderStatsView(show, context)
            break;
        case "details":
            render = renderDetailsView(show, context)
            break;
        default:
            throw Error("Unsupported View " + view)
    }
    clear(document.body)
    document.body.append(render)
}

async function generateContext(): Promise<Context> {
    return {
        database: await openStorageDB()
    }
}

function renderLoader() {
    let res = addClasses(create('main'), 'container')
    create('article', res).setAttribute('aria-busy', 'true')
    return res;
}


main();



