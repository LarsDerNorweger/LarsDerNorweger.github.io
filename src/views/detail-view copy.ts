import { Context } from "../context";
import { addClasses, create } from "../dom";
import { showCallBack } from "./views";

export function renderDetailsView( showView:showCallBack,context:Context):HTMLElement
{
    console.log(context)

    let main =  addClasses( create('main'),'container')
    let header = create('header',main,'Search')
    create('button',header, 'back').onclick = ()=> showView('main')
    return main;
}