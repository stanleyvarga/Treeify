import {
  objectWithoutKey,
  trimSlashes,
  splitPath,
  hashCode
} from './utils'

// Algorithm customized from 
// https://stackoverflow.com/questions/22367711/construct-hierarchy-tree-from-flat-list-with-parent-field/22367819#22367819
export function treeify(listNodes) {
  let tree = []
  let lookup = lookupFrom(listNodes)

  for(let node of listNodes) {
    // If no parent specified, and node is directory
    // We consider it root directory
    if (node.parent !== null && isDirectoryNode(node)) {
      lookup[node.parent].dirs.push(node)

    } else if (isFileNode(node)) {
      // If node is file, we push the file to the node.files
      // In parent node of the file, as each file will always have parent
      // Even if no parent specified, the parent will be '/' (root)
      lookup[node.parent].files.push(node)

    } else {
      // Parent is null, so we push root object from the lookup table
      // To the tree - ONCE. All elements in the lookup table, should 
      // Have references to dirs and files, so the tree is already build
      tree.push(lookup[node.id])
    }
  }

  return tree
}

/*
  * Creates relationships to nodes
  * e.g.: path 'A/B/3' becomes
  * const list = [{id: 'A': parent: null}, {id: 'B', parent: 'A'}, {id: '3', parent: 'B'}]
  * treeify(list) becomes: 
  *      A
  *     /
  *    B 
  *   /  
  *  3
  * 
  * Another node could have path like 'A/B/C' and another 'A/B/D'
  * const list = [{id: 'A': parent: null}, {id: 'B', parent: 'A'}, {id: 'C', parent: 'B'}, {id: 'D', parent: 'B'}]
  * treeify(list) becomes: N-Ary Tree
  *        A
  *      /
  *     B
  *   / | \ 
  *  3  D  C
*/
export function parentify(list)  {
  // Lookup here serves only to skip duplicate directory nodes
  let lookup = {}
  // Every single node in list is relative to 
  // either null or '/' or 'root' e.g.: same parent
  // TODO: custom root node type
  let parent = null
  let parentifiedList = []
  
  for(let node of list) {
    let pathArr = splitPath(node.path)
    for(let pathNode of pathArr) {

      let parentID = hashCode(pathNode)
      if(lookup[parentID] === undefined) {

        lookup[parentID] = parentID
        parentifiedList.push({
          id: parentID,
          label: pathNode,
          parent: parent
        })
      }

      parent = parentID
    }

    // Now that parent exists, files can be pushed 
    // and skip duplicates
    let nodeID = hashCode(node.name)
    if(lookup[nodeID] === undefined) {

      lookup[nodeID] = nodeID
      let nodePath = trimSlashes(node.path)
      parentifiedList.push({
        id: hashCode(node.name),
        ...objectWithoutKey('path', node),
        path: nodePath,
        parent: parent
      })
    }

    // To next iteration parent must be null
    // In case that multiple nodes start on root
    parent = null
  }
  
  return parentifiedList
}

// Lookup table gives us access to id in O(1)
// So we do not have to traverse tree branches
function lookupFrom(fileList) {
  var lookup = {}
  for(let node of fileList) {
    lookup[node.id] = node
    // Create dirs and files only for directory nodes
    if(!isFileNode(node)) {
      node.dirs = []
      node.files = []
    }
  }
  return lookup
}

// Truthiness depends on whether object property 'name' 
// exists on the object or not
// Only files have property name defined
// ? I would personally refactor this, but only for typescript
// ? Where this could be solved with types
function isFileNode(node) {
  return ('name' in node) === true
}
function isDirectoryNode(node) {
  return ('name' in node) === false
}
export default {} 