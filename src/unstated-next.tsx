import React from "react"

interface ContainerProviderProps {
	children: React.ReactNode
}

interface Container<Value> {
	Provider: React.ComponentType<ContainerProviderProps>
	useContainer: () => Value
}

export function createContainer<Value>(useHook: () => Value): Container<Value> {
	let Context = React.createContext<Value | null>(null)

	function Provider(props: ContainerProviderProps) {
		let value = useHook()
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

export function useContainer<Value>(container: Container<Value>): Value {
	return container.useContainer()
}
