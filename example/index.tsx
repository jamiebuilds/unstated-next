import React, { useState } from "react"
import createContainer from "../src/liftHook"
import { render } from "react-dom"

function useCounter(initialState = 0) {
	let [count, setCount] = useState(initialState)
	let decrement = () => setCount(count - 1)
	let increment = () => setCount(count + 1)
	return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay() {
	let counter = Counter.useContainer()
	return (
		<div>
			<button onClick={counter.decrement}>-</button>
			<span>{counter.count}</span>
			<button onClick={counter.increment}>+</button>
		</div>
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
