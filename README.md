# @jvanderen1/unstated-next

> Up-to-date version of everyone's favorite state management library [unstated-next](https://github.com/jamiebuilds/unstated-next)

## Motivation

As a long time fan of creating my own custom hooks for React Context, I came across unstated-next. 
While I do find the API simple yet robust, the repository appears to be going stale with the pull requests
and issues going unanswered. Thus, this fork was created to continue on the efforts of the original package.

## Original Description

- **React Hooks** _use them for all your state management._
- **~200 bytes** _min+gz._
- **Familiar API** _just use React as intended._
- **Minimal API** _it takes 5 minutes to learn._
- **Written in TypeScript** _and will make it easier for you to type your React code._

But, the most important question: Is this better than Redux? Well...

- **It's smaller.** _It's 40x smaller._
- **It's faster.** _Componentize the problem of performance._
- **It's easier to learn.** _You already will have to know React Hooks & Context, just use them, they rock._
- **It's easier to integrate.** _Integrate one component at a time, and easily integrate with every React library._
- **It's easier to test.** _Testing reducers is a waste of your time, make it easier to test your React components._
- **It's easier to typecheck.** _Designed to make most of your types inferable._
- **It's minimal.** _It's just React._

So you decide.

## Install

```sh
npm install @jvanderen1/unstated-next
```

## Example

```jsx
import { useState } from 'react'
import { render } from 'react-dom'
import { createContainer } from '@jvanderen1/unstated-next'

function useCounter(initialState = 0) {
  let [count, setCount] = useState(initialState)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter, 'Counter')

function CounterDisplay() {
  let counter = Counter.useContext()
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
```

To run an example, download this repo and run the following commands:

```sh
npm install
npm run serve
```

## API

### `createContainer(useHook, displayName?)`

<details><summary><b>Show example</b></summary>

```jsx
import { createContainer } from 'unstated-next'

function useCustomHook() {
  let [value, setValue] = useState()
  let onChange = (e) => setValue(e.currentTarget.value)
  return { value, onChange }
}

let Container = createContainer(useCustomHook)
// Container === { Provider, useContext }
```

</details>

### `<Container.Provider>`

<details><summary><b>Show example</b></summary>

```jsx
function ParentComponent() {
  return (
    <Container.Provider>
      <ChildComponent />
    </Container.Provider>
  )
}
```

</details>

### `<Container.Provider initialState>`

<details><summary><b>Show example</b></summary>

```jsx
function useCustomHook(initialState = '') {
  let [value, setValue] = useState(initialState)
  // ...
}

function ParentComponent() {
  return (
    <Container.Provider initialState={'value'}>
      <ChildComponent />
    </Container.Provider>
  )
}
```

</details>

### `Container.useContext()`

<details><summary><b>Show example</b></summary>

```jsx
function ChildComponent() {
  let input = Container.useContext()
  return <input value={input.value} onChange={input.onChange} />
}
```

</details>

## Guide

If you've never used React Hooks before, I recommend pausing and going to read
through [the excellent docs on the React site](https://reactjs.org/docs/hooks-intro.html).

So with hooks you might create a component like this:

```jsx
function CounterDisplay() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

Then, if you want to share the logic behind the component, you could pull it out
into a custom hook:

```jsx
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

function CounterDisplay() {
  let counter = useCounter()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}
```

But what if you want to share the state in addition to the logic, what do you do?

This is where context comes into play:

```jsx
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

let Counter = createContext(null)

function CounterDisplay() {
  let counter = useContext(Counter)
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

function App() {
  let counter = useCounter()
  return (
    <Counter.Provider value={counter}>
      <CounterDisplay />
      <CounterDisplay />
    </Counter.Provider>
  )
}
```

This is great, it's perfect, more people should write code like this.

But sometimes we all need a little bit more structure and intentional API design in order to get it consistently right.

By introducing the `createContainer()` function, you can think about your custom hooks as "containers" and have an API that's clear and prevents you from using it wrong.

```jsx
import { createContainer } from 'unstated-next'

function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay() {
  let counter = Counter.useContext()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <CounterDisplay />
    </Counter.Provider>
  )
}
```

Here's the diff of that change:

```diff
- import { createContext, useContext } from "react"
+ import { createContainer } from "@jvanderen1/unstated-next"

  function useCounter() {
    ...
  }

- let Counter = createContext(null)
+ let Counter = createContainer(useCounter)

  function CounterDisplay() {
-   let counter = useContext(Counter)
+   let counter = Counter.useContext()
    return (
      <div>
        ...
      </div>
    )
  }

  function App() {
-   let counter = useCounter()
    return (
-     <Counter.Provider value={counter}>
+     <Counter.Provider>
        <CounterDisplay />
        <CounterDisplay />
      </Counter.Provider>
    )
  }
```

If you're using TypeScript (which I encourage you to learn more about if you are not), this also has the benefit of making TypeScript's built-in inference work better. As long as your custom hook is typed, then everything else will just work.

## Tips

### Tip #1: Composing Containers

Because we're just working with custom React hooks, we can compose containers inside of other hooks.

```jsx
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment, setCount }
}

let Counter = createContainer(useCounter)

function useResettableCounter() {
  let counter = Counter.useContext()
  let reset = () => counter.setCount(0)
  return { ...counter, reset }
}
```

### Tip #2: Keeping Containers Small

This can be useful for keeping your containers small and focused. Which can be important if you want to code split the logic in your containers: Just move them to their own hooks and keep just the state in containers.

```jsx
function useCount() {
  return useState(0)
}

let Count = createContainer(useCount)

function useCounter() {
  let [count, setCount] = Count.useContext()
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  let reset = () => setCount(0)
  return { count, decrement, increment, reset }
}
```

### Tip #3: Optimizing components

There's no "optimizing" `unstated-next` to be done, all of the optimizations you might do would be standard React optimizations.

#### 1) Optimizing expensive sub-trees by splitting the component apart

**Before:**

```jsx
function CounterDisplay() {
  let counter = Counter.useContext()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
      <div>
        <div>
          <div>
            <div>SUPER EXPENSIVE RENDERING STUFF</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**After:**

```jsx
function ExpensiveComponent() {
  return (
    <div>
      <div>
        <div>
          <div>SUPER EXPENSIVE RENDERING STUFF</div>
        </div>
      </div>
    </div>
  )
}

function CounterDisplay() {
  let counter = Counter.useContext()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
      <ExpensiveComponent />
    </div>
  )
}
```

#### 2) Optimizing expensive operations with useMemo()

**Before:**

```jsx
function CounterDisplay(props) {
  let counter = Counter.useContext()

  // Recalculating this every time `counter` changes is expensive
  let expensiveValue = expensiveComputation(props.input)

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}
```

**After:**

```jsx
function CounterDisplay(props) {
  let counter = Counter.useContext()

  // Only recalculate this value when its inputs have changed
  let expensiveValue = useMemo(() => {
    return expensiveComputation(props.input)
  }, [props.input])

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}
```

#### 3) Reducing re-renders using React.memo() and useCallback()

**Before:**

```jsx
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay(props) {
  let counter = Counter.useContext()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <p>You clicked {counter.count} times</p>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}
```

**After:**

```jsx
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = useCallback(() => setCount(count - 1), [count])
  let increment = useCallback(() => setCount(count + 1), [count])
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

let CounterDisplayInner = React.memo((props) => {
  return (
    <div>
      <button onClick={props.decrement}>-</button>
      <p>You clicked {props.count} times</p>
      <button onClick={props.increment}>+</button>
    </div>
  )
})

function CounterDisplay(props) {
  let counter = Counter.useContext()
  return <CounterDisplayInner {...counter} />
}
```

#### 4) Wrapping your elements with `useMemo()`

[via Dan Abramov](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**Before:**

```jsx
function CounterDisplay(props) {
  let counter = Counter.useContext()
  let count = counter.count

  return <p>You clicked {count} times</p>
}
```

**After:**

```jsx
function CounterDisplay(props) {
  let counter = Counter.useContext()
  let count = counter.count

  return useMemo(() => <p>You clicked {count} times</p>, [count])
}
```
