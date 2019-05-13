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

> 永远不必再考虑 React 状态管理了，仅仅 200 字节的状态管理解决方案。

- **React Hooks** _React Hooks 用做你所有的状态管理。_
- **~200 bytes** _min+gz._
- **熟悉的 API** _仅仅使用了 React，没有依赖第三方库。_
- **最小 API** _只需 5 分钟学习。_
- **TypeScript 编写** _推断代码更容易，易于编写 React 代码。_

但是，最重要的问题是：这比 Redux 更好吗？ 答案可能是。

- **它更小。** _比 Redux 小 40 倍。_
- **它更快。** _组件性能问题。_
- **它更容易学习。** _你必须已经知道 React Hooks 和 Context 。只需使用它们，它们就会嗨起来。_
- **更容易集成。** _一次集成一个组件，并且轻松与其他 React 库集成。_
- **它更容易测试。** _测试 reducers 纯属浪费你的时间，这个库使你更容易测试 React 组件。_
- **它更容易进行类型检查。** _旨在使你的大多数类型可推断。_
- **它是最小的。** _仅仅使用了 React 。_

你自己看着办吧！

### [查看 Unstated 迁移手册 &rarr;](#%E4%BB%8E-unstated-%E8%BF%81%E7%A7%BB)

## 安装

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
  let [value, setInput] = useState()
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

## 指南

如果你以前从未使用过 React Hooks，我不建议你往下看，请先阅读 [React 官网的 React Hooks 文档]（https://reactjs.org/docs/hooks-intro.html）。

首先，使用 React Hooks，你可以创建这样一个组件：

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

然后，如果你想共享组件的逻辑，你可以把它写在组件外面，自定义一个 hook:

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

但是，除了共享逻辑之外，你还想共享状态，你会怎么做呢？

这个时候，context 就发挥了作用：

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

这很棒，也很完美，更多人应该编写这样的代码。

但有时我们需要更多的结构和特定的 API 设计才能使其始终保持正确。

通过引入 `createContainer()` 函数，你可以将自定义 hooks 作为 containers，并且定义明确的 API，防止错误使用。

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

下面是前后的代码对比：

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

如果你正在使用 TypeScript（我鼓励你了解更多关于它的信息），这也有助于 TypeScript 的内置推断做得更好。只要你的自定义 hook 类型是完善的，那么类型都会自动推断。

## 提示

### 提示 #1: 组合 Containers

因为我们只使用了自定义 React hooks，所以可以在其他 hooks 内部组合 containers。

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

### 提示 #2: 保持 Containers 很小

这对于保持 containers 小而集中非常有用。 如果你想在 containers 中对代码进行逻辑拆分，那么这一点非常重要。只需将它们移动到自己的 hooks 中，仅保存 containers 的状态即可。

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

### 提示 #3: 优化组件

`unstated-next` 无需优化。所有你要做的优化，都是标准的 React 优化。

#### 1) 通过拆分组件来优化耗时的子树

**优化前:**

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

**优化后:**

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

#### 2) 使用 useMemo() 优化耗时的操作

**优化前:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // 每次 `counter` 改变都要重新计算这个值，非常耗时
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

**优化后:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // 仅在输入更改时重新计算这个值
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

#### 3) 使用 React.memo()、useCallback() 减少重新渲染次数

**优化前:**

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

**优化后:**

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

## 与 Unstated 的关系

我认为这个库是 [Unstated](https://github.com/jamiebuilds/unstated) 精神的继承者。因为我相信 React 在状态管理方面已经非常出色，唯一缺少的就是轻松共享状态和逻辑，所以我创建了 Unstated 。我创建的 Unstated 是 React 共享状态和逻辑的 **最小** 解决方案。

然而，使用 Hooks，React 在共享状态和逻辑方面可以做得更好。我甚至认为 Unstated 成为了不必要的抽象。

**但是**，我认为很多开发人员都在努力了解如何使用 React Hooks 共享状态和逻辑，从而实现应用程序共享状态。这可能只是文档和社区动力的问题，但我认为一个新的 API 可以弥补这种心理差距。

这个 API 就是 Unstated Next。 它不是 **React 中共享状态和逻辑的最小 API**，而是**用于理解如何在 React 中共享状态和逻辑的最小 API**。

我一直给 React 站队。我希望 React 可以赢。 我希望社区放弃像 Redux 这样的状态管理库，并找到使用 React 内置工具链的更好方法。

如果你不想使用 Unstated，你只想使用 React 本身，我非常鼓励你这么做。 写关于它的博客文章！ 讨论它！ 在社区中传播你的知识。

## 从 `unstated` 迁移

我故意将其发布为单独的包，因为它是对原有 API 的完全重写。 这样，你可以逐步安装和迁移。

请向我提供有关该迁移过程的反馈，因为在接下来的几个月里，我希望得到这些反馈并做以下两件事：

- 确保 `unstated-next` 满足 `unstated` 使用者的所有需求。
- 确保 `unstated` 使用者的代码可以完整地迁移到 `unstated-next`。

我可以将 API 新增到两者的任意一个仓库中，从而使开发人员工作得更轻松。 对于 `unstated-next`，我将保证新增的 API 尽可能小，同时，我也会尽量保持库很小。

未来，我可能会将 `unstated-next` 合并为 `unstated` 的主要版本。 `unstated-next` 仍然存在，这样你就可以安装 `unstated@2` 和 `unstated-next`。 当你完成迁移后，你可以更新到 `unstated@3` ，同时删除 `unstated-next`（确保更新你所有的引入，这应该只是一个查找和替换的过程）。

尽管这是一个重大的 API 更改，我希望你尽可能轻松地完成此迁移。我正在使用最新的 React Hooks API ，为你进行优化，而不是使用原有的 `Unstated.Container` 代码。请随意提供有关如何做得更好的反馈。
