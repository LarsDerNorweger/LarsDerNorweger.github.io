export function create<T extends keyof HTMLElementTagNameMap>(element: T, target?: HTMLElement, text?: string) {
    let res = document.createElement(element)
    res.innerText = text ?? ""
    target?.append(res)
    return res
}

export function addClasses<T extends HTMLElement>(element: T, ...classes: string[]): T {
    element.classList.add(...classes)
    return element;
}


export function removeClasses(element: HTMLElement, ...classes: string[]): HTMLElement {
    element.classList.remove(...classes)
    return element;
}

export function setRole<T extends HTMLElement>(element: T,role: string): T
{
    element.role = role
    return element
} 

export function clear(target: HTMLElement) {
    while (target.hasChildNodes())
        target.firstChild?.remove()
}

export function renderTable(target: HTMLElement, ...header: string[]): HTMLTableElement {
    let res = create('table', target)
    let h = create('tr', create('thead', res))
    for (let s of header)
        create('th', h, s)
    let x = create('tbody', res)
    return res;

}
export function renderTableRow(target: HTMLTableElement, ...content: HTMLElement[]): HTMLTableRowElement {
    let body = target.tBodies.item(0)
    if (!body)
        body = create('tbody', target)
    let row = create('tr', body)
    for (let c of content)
        create('td', row).append(c)
    return row;
}
