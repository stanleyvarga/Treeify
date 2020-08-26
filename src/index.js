import {
  objectWithoutKey,
  trimSlashes,
  splitPath,
  hashCode
} from './utils'

// Algorithm customized from 
// https://stackoverflow.com/questions/22367711/construct-hierarchy-tree-from-flat-list-with-parent-field/22367819#22367819
export function treeify(listNodes) {
  listNodes = parentify(listNodes)
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

// In order to properly parse tree, List of Nodes is created
// With all necessary relationships to parent nodes
// This way, creating tree becomes O(N) 
// And preparing Node list (M*N), but as M will never be higher than 10
// This could be considered O(N)-ish
export function parentify(nodeList)  {
  // Lookup here serves only to skip duplicate directory nodes
  let lookup = {}
  let parentifiedList = []

  // Every single node in nodeList is relative to null / '/' / 'root'
  // e.g.: same parent
  let parent = null

  for(let node of nodeList) {
    let nodeID = hashCode(node.name)
    // Looping left to right, we first set parent to be the left most element
    // like 'home/videos/movies/mr-robot' 
    // parent to videos is home, to movies is videos, to mr-robot is movies..etc
    let pathArr = splitPath(node.path)
    for(let directory of pathArr) {

      let parentID = hashCode(directory)
      // List skips duplicates, save only distinct nodes 
      if(lookup[parentID] === undefined) {
        lookup[parentID] = directory
        parentifiedList.push({
          id: parentID,
          title: directory,
          parent: parent
        })
      }
      parent = parentID
    }

    // Now that parent exists, files can be pushed 
    // and skip duplicates
    if(lookup[nodeID] === undefined) {
      lookup[nodeID] = node
      // trim slashes from paths like '/video'
      let nodePath = trimSlashes(node.path)
      parentifiedList.push({
        id: hashCode(node.name),
        // 'path' will be left out
        ...objectWithoutKey('path', node),
        // trimmed path appended
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