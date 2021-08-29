// Imports
// -------

// Interfaces
import { ContainerProviderProps } from './ContainerProviderProps'
// Types
import { ComponentType } from 'react'

// Internal
// --------

interface Container<V, S = void> {
  Provider: ComponentType<ContainerProviderProps<S>>
  useContext: () => V
}

// Exports
// -------

// Named
export { Container }
