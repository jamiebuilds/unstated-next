// Imports
// -------

// Libraries
import { useContext } from 'react'
// Interfaces
import { Context as ContextInterface } from 'react'
// Symbols
import { empty } from './symbols'

// Internal
// --------

function createUseContext<V>({
  Context,
}: {
  Context: ContextInterface<V | typeof empty>
}): () => V {
  return () => {
    const value = useContext(Context)
    if (value === empty) {
      throw new Error(
        `Component must be wrapped with <${Context.displayName}.Provider>`,
      )
    }
    return value
  }
}

// Exports
// -------

// Named
export { createUseContext }
