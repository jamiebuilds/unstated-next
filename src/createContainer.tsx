// Imports
// -------

// Libraries
import { createContext } from 'react'
// Utilities
import { createProvider } from './createProvider'
import { createUseContext } from './createUseContext'
// Interfaces
import { Container, ContainerOptions } from './interfaces'
// Types
import { UseHook } from './types'
// Symbols
import { empty } from './symbols'

// Internal
// --------

function createContainer<V, S = void>(
  useHook: UseHook<V, S>,
  options?: ContainerOptions,
): Container<V, S> {
  const ContainerContext = createContext<V | typeof empty>(empty)
  ContainerContext.displayName = options?.displayName
    ? options.displayName
    : 'ContainerContext'

  const Provider = createProvider({ Context: ContainerContext, useHook })
  const useContext = createUseContext({ Context: ContainerContext })

  return { Provider, useContext }
}

// Exports
// -------

// Named
export { createContainer }
