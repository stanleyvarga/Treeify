import hash from 'hash.js'

// Removes key from object
export function objectWithoutKey(key, object) {
  const {[key]: deletedKey, ...otherKeys} = object
  return otherKeys
}

export function trimSlashesLeft(str) {
  return str.replace(/^\/+/, '')
}

export function trimSlashesRight(str) {
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

export function hashCode(str) {
  return hash.sha256().update(str).digest('hex').substring(0, 10)
}
export default {}