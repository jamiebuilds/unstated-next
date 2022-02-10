import React from "react"
import omit from "./omit"

const EMPTY: unique symbol = Symbol()
export type ModelProviderProps<State = any> = Omit<State, "children"> & {
	children?: React.ReactNode
}

export interface Model<Value, State = void> {
	Provider: React.ComponentType<ModelProviderProps<State>>
	useContainer: () => Value
	newInstance: () => Model<Value, State>
}

export default function createContainer<
	T extends (props: any) => any,
	Value = ReturnType<T>,
	State = Parameters<T>[0]
>(useHook: T, displayName?: string): Model<Value, State> {
	const HooksContext = React.createContext<Value | typeof EMPTY>(EMPTY)
	HooksContext.displayName = displayName

	function Provider(props: ModelProviderProps<State>) {
		const value = useHook(omit(props, ["children"]))
		return (
			<HooksContext.Provider value={value}>
				{props.children}
			</HooksContext.Provider>
		)
	}

	function useContainer(): Value {
		const value = React.useContext(HooksContext)
		if (value === EMPTY) {
			throw new Error("Component must be wrapped with <Model.Provider>")
		}
		return value
	}

	function newInstance() {
		return createContainer(useHook)
	}
	return { Provider, useContainer, newInstance }
}
