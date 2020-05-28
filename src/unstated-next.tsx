import React from "react"

const EMPTY: unique symbol = Symbol()

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface ContainerConsumerProps<Value> {
	children: (value: Value) => React.ReactNode
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
	Consumer: React.ComponentType<ContainerConsumerProps<Value>>
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

	function Consumer(props: ContainerConsumerProps<Value>) {
		return (
			<Context.Consumer>
				{value => {
					if (value === EMPTY) {
						throw new Error(
							"Component must be wrapped with <Container.Provider>",
						)
					}
					return props.children(value)
				}}
			</Context.Consumer>
		)
	}

	return { Provider, useContainer, Consumer }
}

export function useContainer<Value, State = void>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}
