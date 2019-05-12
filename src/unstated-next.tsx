import React from "react"

export interface ContainerProviderProps<InitialState> {
	children: React.ReactNode
	initialState?: InitialState | null | undefined
}

export interface Container<Value, InitialState> {
	Provider: React.ComponentType<ContainerProviderProps<InitialState | null>>
	useContainer: () => Value
}

export function createContainer<Value, InitialState>(
	useHook: (initialState: InitialState | null | undefined) => Value,
): Container<Value, InitialState> {
	let Context = React.createContext<Value | null>(null)

	function Provider(
		props: ContainerProviderProps<InitialState | null | undefined>,
	) {
		let value = useHook(props.initialState)
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	function useContainer(): Value {
		let value = React.useContext(Context)
		if (value === null) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export function useContainer<Value, InitialState>(
	container: Container<Value, InitialState>,
): Value {
	return container.useContainer()
}
