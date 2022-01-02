import React from "react"

const EMPTY: unique symbol = Symbol()

export type ContainerProviderProps<
	State extends any
> = React.PropsWithChildren<{
	initialState?: State
}>

export interface Container<Value, State extends any> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
}

export function createContainer<Value, State extends any>(
	useHook: (initialState?: State) => Value,
): Container<Value, State> {
	let Context = React.createContext<Value | typeof EMPTY>(EMPTY)

	function Provider(props: ContainerProviderProps<State>) {
		let value = useHook(props.initialState)
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	function useContainer(): Value {
		let value = React.useContext(Context)
		if (value === EMPTY) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export function useContainer<Value, State extends any>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}
