/**
 * @see https://github.com/moroshko/shallow-equal/blob/master/src/arrays.js
 */
const _shallowEqual = ( objA: object, objB: object ) => {
  if (objA === objB) 
    return true

  if (!objA || !objB)
    return false
  
  const aKeys = Object.keys(objA)
  const bKeys = Object.keys(objB)
  const len = aKeys.length

  if (bKeys.length !== len) 
    return false

  for (let i = 0; i < len; i++) {
    let key = aKeys[i]
    // @ts-ignore
    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key))
      return false
  }

  return true
}


/**
 * Compares two objects to see if the entries are equal. This is a shallow comparison.
 * @param sourceObject 
 * @param newObject This object does not have to have all the keys of the sourceObject.
 * @param ignoreKeys An array of keys to ignore.
 * @returns `true` if objects are equal, `false` otherwise.
 */
export default <SourceObjectType extends object, NewObjectType extends object>( sourceObject: SourceObjectType, newObject: NewObjectType ) => {
  if (typeof sourceObject !== 'object' || typeof newObject !== 'object')
    return { result: false, newObject }

  sourceObject = { ...sourceObject }
  newObject = { ...sourceObject, ...newObject }

  const isEqual = _shallowEqual(sourceObject, newObject)

  return {
    result: isEqual,
    newObject,
  }
}
