import { Context } from "./context";
import { openStorageDB } from "./db/storage-db";
import { addClasses, clear, create } from "./dom"
import './main.scss'
import { renderDetailsView } from "./views/detail-view copy";
import { renderEditView } from "./views/edit-view";
import { renderMainView } from "./views/main-view";
import { renderSearchView } from "./views/search-view";
import { renderStatsView } from "./views/stats-view";
import { showCallBack, views } from "./views/views";


document.title = "Vorratshaltung"

let context: Context

async function main() {
    document.body.append(renderLoader())
    try {
        context = await generateContext()
        await show('main',true)
    }
    catch (e) {
        console.error(e)
    }
    window.onpopstate = handlePopHistory
}

let show: showCallBack = async (view, replaceState) => {
    let render: HTMLElement;
    console.log("Show View", view)
    clear(document.body)
    document.body.append(renderLoader())

    let x = new URL(location.href)
    x.searchParams.delete('view')
    x.searchParams.append('view', view)
    if (replaceState)
        history.replaceState('', '', x)
    else
        history.pushState('', '', x)
    localStorage.setItem('ui-view', view)

    switch (view) {
        case "search":
            render = await renderSearchView( context)
            break;
        case "main":
            render = renderMainView(show, context)
            break;
        case "edit":
            render = await renderEditView(show, context)
            break;
        case "stats":
            render = await renderStatsView(show, context)
            break;
        case "details":
            render = await renderDetailsView(show, context)
            break;
        default:
            throw Error("Unsupported View " + view)
    }
    clear(document.body)
    document.body.append(render)
}

async function handlePopHistory() {
    let x = new URL(location.href)
    let view: views = <views>x.searchParams.get('view') || "main"
    try {
        show(<views>view,true)
    }
    catch (e) {
        console.log('Failed to recover View', view, 'Show main view')
        show('main',true)
    }
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



