import React from "react"

export interface ContainerProviderProps {
	children: React.ReactNode
}

export interface Container<Value> {
	Provider: React.ComponentType<ContainerProviderProps>
	useContainer: () => Value
}

export function createContainer<Value>(useHook: () => Value): Container<Value> {
	const Context = React.createContext<Value | null>(null)

	function Provider(props: ContainerProviderProps) {
		const value = useHook()
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	function useContainer(): Value {
		const value = React.useContext(Context)
		if (value === null) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export function useContainer<Value>(container: Container<Value>): Value {
	return container.useContainer()
}
