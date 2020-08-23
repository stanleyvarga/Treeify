
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
export function parentify(fileList)  {
  // Lookup here serves only to skip duplicate directory nodes
  let lookup = {}
  let list = []
  let parent = null

  for(let file of fileList) {
    let fileID = hashCode(file.name)
    // Looping left to right, we first set parent to be the left most element
    // like 'home/videos/movies/mr-robot' 
    // parent to videos is home, to movies is videos, to mr-robot is movies..etc
    let pathArr = splitPath(file.path)
    for(let directory of pathArr) {

      let parentID = hashCode(directory)
      // List skips duplicates, save only distinct nodes 
      if(lookup[parentID] === undefined) {
        lookup[parentID] = directory
        list.push({
          id: parentID,
          title: directory,
          parent: parent
        })
      }
      parent = parentID
    }

    // Now that parent exists, files can be pushed 
    // and skip duplicates
    if(lookup[fileID] === undefined) {
      lookup[fileID] = file
      // trim slashes from paths like '/video'
      let filePath = trimSlashes(file.path)
      list.push({
        id: hashCode(file.name),
        // 'path' will be left out
        ...objectWithoutKey('path', file),
        // trimmed path appended
        path: filePath,
        parent: parent
      })
    }

    // To next iteration parent must be null
    // In case that multiple nodes start on root
    parent = null
  }
  
  return list
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

// Removes key from object
function objectWithoutKey(key, object) {
  const {[key]: deletedKey, ...otherKeys} = object
  return otherKeys
}

function trimSlashesLeft(str) {
  return str.replace(/^\/+/, '')
}

function trimSlashesRight(str) {
  return str.replace(/\/+$/, '')
}

export function trimSlashes(str) {
  if (str === '/' || str === '') {
    return '/'
  }
  return trimSlashesLeft(trimSlashesRight(str))
}

export function splitPath(path) {
  if (path === '/' || path === '') {
    return '/'
  }
  return trimSlashes(path).split('/')
}

// Hash code creates hash of string, 
// This method should be replaced for method that creates fixed size
// hashes, because for '/', returned hash is two digit => 47 etc..
export function hashCode(str) {
  var hash = 0, i = 0, len = str.length
  while ( i < len ) {
      hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0
  }
  return Math.abs(hash)
}
export default {} 