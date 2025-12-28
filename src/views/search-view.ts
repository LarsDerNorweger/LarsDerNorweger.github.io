import { Context } from "../context";
import { addClasses, create } from "../dom";
import { showCallBack } from "./views";

export function renderSearchView( showView:showCallBack,context:Context):HTMLElement
{
    console.log(context)

    let main =  addClasses( create('main'),'container')
    let header = create('nav', create('header', main))
    create('button',header, 'back').onclick = ()=> history.back()
    return main;
}