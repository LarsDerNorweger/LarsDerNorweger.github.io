import { Context } from "../context";
import { addClasses, create, setRole } from "../dom";
import { showCallBack } from "./views";

export function renderMainView(showView:showCallBack, context:Context):HTMLElement
{
    console.log(context)
    let main =  addClasses( create('main'),'container')
    create('h2',create('header',main),'Lagerhaltung')
    setRole( create('div',main,'Suchen'),'button').onclick = () => showView("search",false)
    setRole( create('div',main,'Gegenstand hinzufuegen'),'button').onclick = () => showView("edit",false)
    setRole( create('div',main,'Übersicht'),'button').onclick = () => showView("stats",false)
    
    return main;
}
