<p align="right">
  <strong>
    <a href="README.md">English</a> |
    <a href="README-zh-cn.md">中文</a> |
    <a href="README-ru-ru.md">Русский</a> |
    <a href="README-th-th.md">ภาษาไทย</a> |
    <a href="README-vi-vn.md">Tiếng Việt</a>
  </strong>
  <br/>
  <sup><em>(Please contribute translations!)</em></sup>
</p>

# Unstated Next

> Chỉ với 200 bytes, không cần lo nghĩ về quản lý React state

- **React Hooks** _dùng React Hooks để quản lý tất cả các state._
- **~200 bytes** _min+gz._
- **API quen thuộc** _viết code như React thuần._
- **API đơn giản** _chỉ tốn 5 phút để học._
- **Written in TypeScript** _việc đặt kiểu cho React code sẽ rất dễ dàng._

Tuy nhiên, câu hỏi quan trọng là: Nó có tốt hơn Redux? Để xem nào...

- **It's smaller.** _Unstated-next nhỏ gọn hơn đến 40 lần._
- **It's faster.** _Component hóa vấn đề về tốc độ._
- **It's easier to learn.** _Nếu bạn đã biết về React Hooks & Context, chỉ cần sử dụng thôi, nó rất tuyệt._
- **It's easier to integrate.** _Tương thích với từng Component một, và có thể kết hợp dễ dàng với mọi thư viện React khác._
- **It's easier to test.** _Kiểm thử reducers rất phí thời gian, nó sẽ đơn giản hơn khi bạn chỉ cần test React components._
- **It's easier to typecheck.** _Thiết kế ra để bạn định nghĩa được hầu hết các types._
- **It's minimal.** _Nó chỉ là React._

Vậy quyết định là ở bạn.

### [Xem các nâng cấp từ Unstated &rarr;](#migration-from-unstated)

## Cài đặt

```sh
npm install --save unstated-next
```

## Ví dụ

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

## Hướng dẫn

Nếu bạn chưa bao giờ sử dụng React Hooks trước đây, Tôi khuyên bạn nên dừng lại và đọc qua [tài liệu tuyệt vời trên trang React](https://reactjs.org/docs/hooks-intro.html).

Vậy với hooks bạn có thể tạo một component như thế này:

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

Sau đó nếu bạn muốn chia sẻ phần logic đằng sau component, bạn có thể tách nó ra thành một custom hook:

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

Nhưng trong trường hợp bạn muốn chia sẻ cả trạng thái lẫn logic, bạn sẽ làm gì?

Đây sẽ là lúc context giúp được bạn:

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

Điều này thật tuyệt, thật hoàn hảo, và mọi người nên viết code theo cách này.

Nhưng đôi khi chúng ta đều cần một cấu trúc rõ ràng và được thiết kế bài bản để mang lại một sự nhất quán.

Xin giới thiệu hàm `createContainer()`, bạn có thể coi như custom hooks của bạn là một "containers" và có một API rõ ràng, có thể ngăn chặn bạn khỏi việc sử dụng nó sai mục đích.

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

Đây là khác biệt của sự thay đổi:

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

Nếu bạn đang sử dụng TypeScript (cái mà tôi khuyến khích bạn học thêm về nó nếu bạn chưa dùng), nó còn có lợi ích trong việc làm các gợi ý có sẵn của TypeScript's hoạt đông tốt hơn. Miễn là custom hook của bạn đã được đặt kiểu, thì mọi thứ sẽ hoạt động.

## Lời khuyên

### Tip #1: Tạo các Containers

Vì chúng ta chỉ đang làm việc với custom React hooks, chúng ta có thể tạo các containers bên trong những hooks khác.

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

### Tip #2: Giữ cho những Containers thật nhỏ

Nó sẽ hữu ích nếu như bạn giữ được các containers của bạn thật nhỏ và tập trung vào một mục đích nhất định. Điều này có thể sẽ quan trọng nếu bạn muốn tách phần logic khỏi containers: Chỉ cần chuyển logic sang phần hooks của nó và giữ state lại ở containers.

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

### Tip #3: Tối ưu hóa components

Không có "tối ưu" `unstated-next` cần làm ở đây, tất cả việc tối ưu bạn có thể phải làm đó là tối ưu React code của bạn.

#### 1) Tối ưu các nhánh component nặng bằng việc chia ra thành một component riêng

**Trước:**

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

**Sau:**

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

#### 2) Tối ưu những phép tính toán nặng bằng useMemo()

**Trước:**

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

**Sau:**

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

#### 3) Giảm thiểu việc render lại bằng React.memo() và useCallback()

**Trước:**

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

**Sau:**

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

#### 4) Gói các elements của bạn với `useMemo()`

[theo Dan Abramov](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**Trước:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return (
    <p>You clicked {count} times</p>
  )
}
```

**Sau:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return useMemo(() => (
    <p>You clicked {count} times</p>
  ), [count])
}
```

## Sự tương quan với Unstated

Tôi coi thư viện này là sự kế thừa tinh thần cho [Unstated](https://github.com/jamiebuilds/unstated). Tôi đã tạo ra Unstated vì tôi tin rằng React đã thực sự tuyệt vời trong việc quản state và điều duy nhất còn thiếu là chia sẻ state, logic một cách dễ dàng. Vì vậy, tôi đã tạo ra Unstated, một giải pháp "tối giản" để chia sẻ React state và logic.

Tuy nhiên, với Hook, React đã trở nên tốt hơn nhiều trong việc chia sẻ state và logic. Đến mức tôi nghĩ Unstated đã trở thành một abstraction không cần thiết.

**Tuy nhiên**, Tôi nghĩ rằng nhiều nhà phát triển đã vật lộn để xem cách chia sẻ state và logic với React Hook trong một "trạng thái của ứng dụng". Đó có thể chỉ là vấn đề về tài liệu và động lực từ cộng đồng, nhưng tôi nghĩ rằng sẽ có một API có thể giúp thu hẹp khoảng cách về tinh thần đó.

API đó chính là Unstated Next. Thay vì là "API tối thiểu để chia sẻ state và logic trong React", giờ đây nó là "API tối thiểu để hiểu state và logic được chia sẻ trong React".

Tôi đã luôn đứng về phía React. Tôi muốn React giành chiến thắng. Tôi muốn thấy cộng đồng từ bỏ các thư viện quản lý state như Redux và tìm ra những cách tốt hơn để sử dụng chuỗi công cụ tích hợp có sẵn của React.

Nếu thay vì sử dụng Unstated, bạn chỉ muốn sử dụng React, tôi rất khuyến khích điều đó. Viết bài đăng trên blog về nó! Hãy kể về nó! Truyền bá kiến thức của bạn trong cộng đồng.

## Cách cập nhật từ `unstated`

Tôi đã cố tình xuất bản thư viện này dưới dạng tên gói riêng vì API đã được viết lại hoàn toàn. Bằng cách này, bạn có thể cài cả hai và migrate dần dần.

Vui lòng cung cấp cho tôi thông tin phản hồi về quá trình migrate đó, vì trong vài tháng tới tôi hy vọng sẽ nhận được nhiều thông tin và thực hiện hai điều:

- Đảm bảo rằng `unstated-next` đáp ứng tất cả các nhu cầu của người dùng` unstated`.
- Đảm bảo rằng `unstated` có một quy trình migrate sạch sẽ đối với` unstated-next`.

Tôi có thể chọn thêm API vào một trong hai thư viện để giúp các nhà phát triển dễ dàng hơn. Đối với `unstated-next` Tôi hứa rằng các API được thêm vào sẽ tối thiểu nhất có thể và tôi sẽ cố gắng giữ thư viện thật nhỏ.

Trong tương lai, tôi có thể sẽ hợp nhất `unstated-next` trở lại thành `unstated` như một phiên bản chính mới. `unstated-next` vẫn sẽ tồn tại để bạn có thể cài đặt cả `unstated@2` và `unstated-next`. Sau đó, khi bạn hoàn thành việc migrate, bạn có thể cập nhật thành `unstated@3` và xóa `unstated-next` (chắc chắn bạn đã cập nhật tất cả các imports... bằng cách tìm kiếm và thay thế).

Mặc dù đây là một thay đổi API mới, tôi hy vọng rằng tôi có thể thực hiện việc migrate này dễ dàng nhất có thể đối với bạn. Tôi đang tối ưu hóa cho bạn để sử dụng API React Hook mới nhất chứ không phải để giữ code được viết bằng `Unstated.Container`. Hãy cho ý kiến của bạn về cách nó có thể được làm tốt hơn.
