import { create, setRole } from './DomHelpers.js';
export { createModalDialog, createSmallButton, createInput, createTable };
/**
 * 
 * @param {HTMLElement} target 
 * @param {string} [heading]
 */
function createModalDialog(target, heading)
{
  let mod = create('dialog', target);
  let node = create('article', mod);
  let footer = null;
  if(heading)
    create('h2', node, heading);
  /**
   * 
   * @param {HTMLAnchorElement} btn 
   */
  function addButton(btn)
  {
    if(footer == null)
      footer = create('footer', node);
    footer.append(btn);
  }

  /**
   * 
   * @param {HTMLElement} content 
   */
  function addContent(content)
  {
    if(footer)
      node.insertBefore(content, footer);
    else node.append(content);
  }
  function show() { mod.showModal(); };
  function remove() { mod.remove(); };
  return {
    addButton,
    addContent,
    remove,
    show
  };
}

/**
 * 
 * @param {string} text 
 * @param {HTMLElement} [target] 
 * @param {(btn:HTMLAnchorElement,event:MouseEvent)=>void} [callback]
 * @param {string[]} classes  
 */
function createSmallButton(text, target, callback, ...classes)
{
  let node = create('a', target, text);
  node.classList.add(...classes);
  node.href = '#';
  if(callback)
    node.onclick = (e) => callback(node, e);
  setRole('button', node);
  return node;
}

/**
 * 
 * @param {string} text 
 * @param {HTMLElement} [target] 
 */
function createInput(text, target)
{
  let node = create('label', target, text);
  let input = create('input', node);
  return {
    node,
    input,
    remove: () => node.remove
  };
}

/**
 * 
 * @param {HTMLElement} target 
 * @param  {string[]} headers 
 * @returns 
 */
function createTable(target, ...headers)
{
  let node = create('table', target);
  setRole('grid', node);
  let head = create('thead', node);
  let body = create('tbody', node);
  let r = addRow();
  for(let i of headers)
    create('th', r, i);

  /**
   * 
   * @param  {HTMLTableCellElement[]} content 
   */
  function addRow(...content)
  {
    let r = create('tr', body);
    for(let i of content)
      r.appendChild(i);
    return r;
  }

  return {
    node,
    head,
    body,
    addRow,
    remove: () => node.remove
  };
}
