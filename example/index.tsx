import React, { useState } from "react"
import { Provider, createContainer } from "../src/unstated"
import { render } from "react-dom"

function useCounter() {
	let [count, setCount] = useState(0)
	let decrement = () => setCount(count - 1)
	let increment = () => setCount(count + 1)
	return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay() {
	let counter = Counter.useContainer()
	return (
		<>
			<button onClick={counter.decrement}>-</button>
			<span>{counter.count}</span>
			<button onClick={counter.increment}>+</button>
		</>
	)
}

function App() {
	return (
		<Provider>
			<CounterDisplay />
			<div>
				<div>
					<CounterDisplay />
				</div>
			</div>
		</Provider>
	)
}

render(<App />, document.getElementById("root"))
