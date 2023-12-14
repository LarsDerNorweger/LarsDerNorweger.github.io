
export
{
  create, clear, setRole
};

/**
 * 
 * @template { keyof HTMLElementTagNameMap } K 
 * @param  {K} type
 * @param {Node} [target] 
 * @param {string} [text] 
 * @returns {HTMLElementTagNameMap[K]} target 
 */
function create(type, target, text)
{
  let res = document.createElement(type);
  if(target)
    target.appendChild(res);
  if(text)
    res.innerText = text;
  return res;
}

/**
 * 
 * @param {string} role 
 * @param {HTMLElement} target 
 */
function setRole(role, target) { target.setAttribute('role', role); }

/**
 * 
 * @param {HTMLElement} target 
 */
function clear(target)
{
  while(target.hasChildNodes())
    target.lastChild.remove();
}
