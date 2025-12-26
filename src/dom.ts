export function create<T extends keyof HTMLElementTagNameMap>(element: T, target?: HTMLElement, text?: string) {
    let res = document.createElement(element)
    res.innerText = text ?? ""
    target?.append(res)
    return res
}

export function addClasses<T extends HTMLElement>(element: T,... classes:string[]):T
{
    element.classList.add(...classes)
    return element;
}


export function removeClasses(element: HTMLElement,... classes:string[]):HTMLElement
{
    element.classList.remove(...classes)
    return element;
}

export function clear(target: HTMLElement) {
    while (target.hasChildNodes())
        target.firstChild?.remove()
}