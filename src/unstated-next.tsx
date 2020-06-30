import React from "react"

const EMPTY: unique symbol = Symbol()

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
	withContainer: <P extends object>(
		Component: React.ComponentType<P>,
	) => (props: P) => React.ReactNode
}

export function createContainer<Value, State = void>(
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

	function withContainer<P extends object>(Component: React.ComponentType<P>) {
		return (props: P) => {
			return (
				<Provider>
					<Component {...props} />
				</Provider>
			)
		}
	}

	return { Provider, useContainer, withContainer }
}

export function useContainer<Value, State = void>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}
