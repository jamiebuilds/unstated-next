import { useState } from 'react'
import { render } from 'react-dom'
import { createContainer } from '../src'

function useCounter(initialState = 0) {
  const [count, setCount] = useState(initialState)
  const decrement = () => setCount(count - 1)
  const increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

const Counter = createContainer(useCounter)

function CounterDisplay() {
  const counter = Counter.useContext()
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
      <Counter.Provider initialState={2}>
        <div>
          <div>
            <CounterDisplay />
          </div>
        </div>
      </Counter.Provider>
    </Counter.Provider>
  )
}

render(<App />, document.getElementById('root'))
