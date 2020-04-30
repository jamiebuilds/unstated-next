import React from "react"

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
}

export function createContainer<Value, State = void>(
	useHook: (initialState?: State) => Value,
): Container<Value, State> {
	let EMPTY = {}
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
		// @ts-ignore
		return value
	}

	return { Provider, useContainer }
}

export function useContainer<Value, State = void>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}
