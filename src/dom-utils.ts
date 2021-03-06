
const IGNORE_NODE_NAMES: Set<string> = new Set(['TEXTAREA', 'INPUT', 'SELECT'])

export function isNodeInput(e: HTMLElement): boolean {
  return e.isContentEditable || IGNORE_NODE_NAMES.has(e.nodeName.toUpperCase())
}

export function findVisiblePointerDOMElements(): HTMLElement[] {
  return Array
    .from(document.body.querySelectorAll('*'))
    .filter((x): x is HTMLElement => {
      if (
        x instanceof HTMLElement
        && x.offsetParent !== null
        // && !("value" in x)
        && !!(x.offsetWidth || x.offsetHeight || x.getClientRects().length)
      ) {
        const style = window.getComputedStyle(x)
        return style.cursor === 'pointer'
          && style.visibility !== 'hidden'
          && style.display !== 'none'
          && style.opacity !== "0"
      } else {
        return false
      }
    })
}

// Function that checks if the given value
// is present in the array from a specific array index.
function includesFromIndex<T>(find: T, fromIndex: number, list: T[]): boolean {
  const length = list.length
  for (let i = fromIndex; i < length; i++) {
    if (list[i] === find) {
      return true
    }
  }
  return false
}

// We have to remove nested-elements representing the same link.
// For every-node we have to check if the parent is also marked as a valid element
// and if it is, we discard the child.
// The HTMLElement list is in order to parent -> child, sibling -> ...
// For performance, we can take advantage of this trait and define an algorithm ->
// - reverse the list elements. This ensures that parentElements only appear after the child element.
// - find parentElement in list. Because of ^, we reduce the complexity of finding parent elements in the source list.
//                               They are likely to be the immediate next element ( or a few elements after )
// - If no parentElement or not in list, push to result list
// - reverse the result list. This restores the element list to the original order.
export function removeNestedPointerElements(elems: HTMLElement[]): HTMLElement[] {

  const filtered: HTMLElement[] = []
  const reversed = elems.slice().reverse()

  reversed.forEach((elem, index, arr) => {
    if (!elem.parentElement || !includesFromIndex(elem.parentElement, index, arr)) {
      filtered.push(elem)
    }
  })

  return filtered.reverse()
}
