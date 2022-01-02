import React, { useState } from "react"
import { createContainer } from "../src/unstated-next"
import { render } from "react-dom"

function useCounter(initialState = 0) {
	const [count, setCount] = useState(initialState)
	const decrement = () => setCount(count - 1)
	const increment = () => setCount(count + 1)
	return { count, decrement, increment }
}

const Counter = createContainer(useCounter)

function useRequiredCounter(step: number) {
	const { count } = Counter.useContainer()
	const computed = count + step
	return { count, step, computed }
}

const RequiredCounter = createContainer(useRequiredCounter)

function CounterDisplay() {
	const counter = Counter.useContainer()
	return (
		<div>
			<button onClick={counter.decrement}>-</button>
			<span>{counter.count}</span>
			<button onClick={counter.increment}>+</button>
		</div>
	)
}

function RequiredCounterDisplay() {
	const { count, step, computed } = RequiredCounter.useContainer()
	return (
		<div>
			Computed Value With Step {step}: {count} + {step} = {computed}
		</div>
	)
}

function App() {
	return (
		<Counter.Provider initialState={[]}>
			<CounterDisplay />
			<Counter.Provider initialState={[2]}>
				<div>
					<div>
						<CounterDisplay />
						<RequiredCounter.Provider initialState={[2]}>
							<RequiredCounterDisplay />
						</RequiredCounter.Provider>
					</div>
				</div>
			</Counter.Provider>
		</Counter.Provider>
	)
}

render(<App />, document.getElementById("root"))
