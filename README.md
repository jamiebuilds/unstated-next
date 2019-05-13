<p align="right">
  <strong>
    <a href="README.md">English</a> |
    <a href="README-zh-cn.md">中文</a> |
    <a href="README-ru-ru.md">Русский</a>
  </strong>
  <br/>
  <sup><em>(Please contribute translations!)</em></sup>
</p>

# Unstated Next

> 200 bytes to never think about React state management libraries ever again

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

### [See Migration From Unstated docs &rarr;](#migration-from-unstated)

## Install

```sh
npm install --save unstated-next
```

## Example

```js
import React, { useState } from "react"
import { createContainer } from "unstated-next"
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

render(<App />, document.getElementById("root"))
```

## API

### `createContainer(useHook)`

```js
import { createContainer } from "unstated-next"

function useCustomHook() {
  let [value, setValue] = useState()
  let onChange = e => setValue(e.currentTarget.value)
  return { value, onChange }
}

let Container = createContainer(useCustomHook)
// Container === { Provider, useContainer }
```

### `<Container.Provider>`

```js
function ParentComponent() {
  return (
    <Container.Provider>
      <ChildComponent />
    </Container.Provider>
  )
}
```

### `<Container.Provider initialState>`

```js
function useCustomHook(initialState = "") {
  let [value, setValue] = useState(initialState)
  // ...
}

function ParentComponent() {
  return (
    <Container.Provider initialState={"value"}>
      <ChildComponent />
    </Container.Provider>
  )
}
```

### `Container.useContainer()`

```js
function ChildComponent() {
  let input = Container.useContainer()
  return <input value={input.value} onChange={input.onChange} />
}
```

### `useContainer(Container)`

```js
import { useContainer } from "unstated-next"

function ChildComponent() {
  let input = useContainer(Container)
  return <input value={input.value} onChange={input.onChange} />
}
```

## Guide

If you've never used React Hooks before, I recommend pausing and going to read
through [the excellent docs on the React site](https://reactjs.org/docs/hooks-intro.html).

So with hooks you might create a component like this:

```js
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

Then if you want to share the logic behind the component, you could pull it out
into a custom hook:

```js
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

```js
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

```js
import { createContainer } from "unstated-next"

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
+ import { createContainer } from "unstated-next"

  function useCounter() {
    ...
  }

- let Counter = createContext(null)
+ let Counter = createContainer(useCounter)

  function CounterDisplay() {
-   let counter = useContext(Counter)
+   let counter = Counter.useContainer()
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

```js
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment, setCount }
}

let Counter = createContainer(useCounter)

function useResettableCounter() {
  let counter = Counter.useContainer()
  let reset = () => counter.setCount(0)
  return { ...counter, reset }
}
```

### Tip #2: Keeping Containers Small

This can be useful for keeping your containers small and focused. Which can be important if you want to code split the logic in your containers: Just move them to their own hooks and keep just the state in containers.

```js
function useCount() {
  return useState(0)
}

let Count = createContainer(useCount)

function useCounter() {
  let [count, setCount] = Count.useContainer()
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

```js
function CounterDisplay() {
  let counter = Counter.useContainer()
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

```js
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
  let counter = Counter.useContainer()
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

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

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

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

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

```js
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

function CounterDisplay(props) {
  let counter = Counter.useContainer()
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

```js
function useCounter() {
  let [count, setCount] = useState(0)
  let decrement = useCallback(() => setCount(count - 1), [count])
  let increment = useCallback(() => setCount(count + 1), [count])
  return { count, decrement, increment }
}

let Counter = createContainer(useCounter)

let CounterDisplayInner = React.memo(props => {
  return (
    <div>
      <button onClick={props.decrement}>-</button>
      <p>You clicked {props.count} times</p>
      <button onClick={props.increment}>+</button>
    </div>
  )
})

function CounterDisplay(props) {
  let counter = Counter.useContainer()
  return <CounterDisplayInner {...counter} />
}
```

## Relation to Unstated

I consider this library the spiritual successor to [Unstated](https://github.com/jamiebuilds/unstated). I created Unstated because I believed that React was really great at state management already and the only missing piece was sharing state and logic easily. So I created Unstated to be the "minimal" solution to sharing React state and logic.

However, with Hooks, React has become much better at sharing state and logic. To the point that I think Unstated has become an unnecessary abstraction.

**HOWEVER**, I think many developers have struggled seeing how to share state and logic with React Hooks for "application state". That may just be an issue of documentation and community momentum, but I think that an API could help bridge that mental gap.

That API is what Unstated Next is. Instead of being the "Minimal API for sharing state and logic in React", it is now the "Minimal API for understanding shared state and logic in React".

I've always been on the side of React. I want React to win. I would like to see the community abandon state management libraries like Redux, and find better ways of making use of React's built-in toolchain.

If instead of using Unstated, you just want to use React itself, I would highly encourage that. Write blog posts about it! Give talks about it! Spread your knowledge in the community.

## Migration from `unstated`

I've intentionally published this as a separate package name because it is a complete reset on the API. This way you can have both installed and migrate incrementally.

Please provide me with feedback on that migration process, because over the next few months I hope to take that feedback and do two things:

- Make sure `unstated-next` fulfills all the needs of `unstated` users.
- Make sure `unstated` has a clean migration process towards `unstated-next`.

I may choose to add APIs to either library to make life easier for developers. For `unstated-next` I promise that the added APIs will be as minimal as possible and I'll try to keep the library small.

In the future, I will likely merge `unstated-next` back into `unstated` as a new major version. `unstated-next` will still exist so that you can have both `unstated@2` and `unstated-next` installed. Then when you are done with the migration, you can update to `unstated@3` and remove `unstated-next` (being sure to update all your imports as you do... should be just a find-and-replace).

Even though this is a major new API change, I hope that I can make this migration as easy as possible on you. I'm optimizing for you to get to using the latest React Hooks APIs and not for preserving code written with `Unstated.Container`'s. Feel free to provide feedback on how that could be done better.
