// Imports
// -------

// Types
import { ReactNode } from 'react'

// Internal
// --------

interface ContainerProviderProps<State = void> {
  initialState?: State
  children: ReactNode
}

// Exports
// -------

// Named
export { ContainerProviderProps }
