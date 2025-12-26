import { Context } from "../context";
import { addClasses, create } from "../dom";
import { showCallBack } from "./views";

export function renderMainView(showView:showCallBack, context:Context):HTMLElement
{
    console.log(context)
    let main =  addClasses( create('main'),'container')
    create('header',main,'Main')
    create('button',main,'Suchen').onclick = () => showView("search")
    create('button',main,'Gegenstand hinzufuegen').onclick = () => showView("edit")
    
    return main;
}
