// Imports
// -------

// Libraries
import PropTypes from 'prop-types'
// Interfaces
import { ContainerProviderProps } from './interfaces'
// Types
import { ComponentType, Context as ContextInterface } from 'react'
import { InferPropTypes, UseHook } from './types'
// Symbols
import { empty } from './symbols'

// Internal
// --------

function createProvider<V, S>({
  Context,
  useHook,
}: {
  Context: ContextInterface<V | typeof empty>
  useHook: UseHook<V, S>
}): ComponentType<ContainerProviderProps<S>> {
  const providerPropTypes = {
    children: PropTypes.node.isRequired,
    initialState: PropTypes.any,
  }

  const providerDefaultProps = {
    initialState: undefined,
  }

  type ProviderProps = InferPropTypes<
    typeof providerPropTypes,
    typeof providerDefaultProps
  >

  function Provider({ children, initialState }: ProviderProps) {
    const value = useHook(initialState)
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  Provider.propTypes = providerPropTypes
  Provider.defaultProps = providerDefaultProps

  return Provider as ComponentType<ContainerProviderProps<S>>
}

// Exports
// -------

// Named
export { createProvider }
