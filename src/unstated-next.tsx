import React from "react"

const EMPTY: unique symbol = Symbol()

export type ContainerProviderProps<
	State extends any[]
> = React.PropsWithChildren<{
	initialState: State
}>

export type UseHookFn<Value, State extends any[]> = (...args: State) => Value
export type ContainerProvider<State extends any[]> = React.ComponentType<
	ContainerProviderProps<State>
>
export type UseContainer<Value> = () => Value
export interface Container<Value, State extends any[]> {
	Provider: ContainerProvider<State>
	useContainer: UseContainer<Value>
}

export function createContainer<Value, State extends any[]>(
	useHook: UseHookFn<Value, State>,
): Container<Value, State> {
	const Context = React.createContext<Value | typeof EMPTY>(EMPTY)
	const hookName = useHook.name
		? `${useHook.name.charAt(0).toUpperCase()}${useHook.name.slice(1)}`
		: "UnstatedNext"
	Context.displayName = `Context${hookName}`

	function Provider({ initialState, children }: ContainerProviderProps<State>) {
		const value = useHook(...initialState)
		return <Context.Provider value={value}>{children}</Context.Provider>
	}

	function useContainer(): Value {
		const value = React.useContext(Context)
		if (value === EMPTY) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return {
		Provider,
		useContainer,
	}
}

export function useContainer<Value, State extends any[]>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}
