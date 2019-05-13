import React, { useState } from "react"
import { createContainer } from "../src/unstated-next"
import { render } from "react-dom"

function useCounter() {
	let [count, setCount] = useState(initialState)
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
		<Counter.Provider>
			<CounterDisplay />
			<Counter.Provider>
				<div>
					<div>
						<CounterDisplay />
					</div>
				</div>
			</Counter.Provider>
		</Counter.Provider>
	)
}

render(<App />, document.getElementById("root"))
