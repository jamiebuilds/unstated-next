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

> ขนาดเพียง 200 ไบต์ ดังนั้น ฉันไม่เคยคิดเรื่อง React state management libraries อีกเลย

- **React Hooks** ใช้เพื่อจัดการสถานะทั้งหมดของคุณ
- **~200 bytes** มีขนาดเพียง 200 ไบต์เท่านั้น
- **Familiar API** เป็นเพียงส่วนเล็กๆในการเขียน React
- **Minimal API** ใช้เวลาเพียง 5 นาทีในการเรียนรู้
- **Written in TypeScript** ทำให้การเขียน React สะดวกมากยิ่งขึ้น

แต่.. คำถามสำคัญคือ มันดีกว่า Redux จริงหรือไม่ ? มาดูคำตอบกัน...

- **It's smaller.** มีขนาดเล็ก 40 เท่า
- **It's faster.** แก้ปัญหาเรื่องประสิทธิภาพการทำงานให้ดียิ่งขึ้น
- **It's easier to learn.** สิ่งที่คุณจะต้องรู้คือ React Hooks และ Context
- **It's easier to integrate.** ง่ายต่อการนำไปต่อยอดและ สามารถทำงานร่วมกับ React library ได้อย่างสบายๆ
- **It's easier to test.** ลดการระยะเวลาในการทดสอบ
- **It's easier to typecheck.** ออกแบบมาเพื่อทำให้คุณสามารถนำไปพัฒนาต่อได้
- **It's minimal.** มันเป็นเพียง React

ดังนั้น ถ้าคุณตัดสินใจ

### [พัฒนาต่อยอดมาจาก Unstated docs &rarr;](#migration-from-unstated)

## ติดตั้ง

```sh
npm install --save unstated-next
```

## ตัวอย่าง

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

## คู่มือ

ถ้าคุณไม่เคยใช้ React Hooks มาก่อน, เราแนะนำให้หยุดและอ่านเอกสารของ React Hooks ก่อน [เอกสารของ React Hooks](https://reactjs.org/docs/hooks-intro.html).

ดังนั้นโดย hooks คุณอาจสร้างคอมโพเนนต์เหมือนกับตัวอย่างข้างล่างนี้

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

จากนั้นถ้าคุณต้องการ share logic behind หลังคอมโพเนนต์,  คุณสามารถดึงมันออกมาเพื่อเป็น Hooks ที่สามารถกำหนดเองได้ :


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

แต่ถ้าคุณต้องการ share state นอกเหนือจาก logic, ควรจะทำอย่างไร ?

นี่เป็นตัวอย่าง :

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

มันเยี่ยมมาก , ยอดเยี่ยม, คนส่วนมากควรเขียนโค้ดแบบนี้

แต่บางครั้งเราทุกคนจำเป็นต้องมีโครงสร้างเพิ่มเติมเล็กน้อย และ โดยเพื่อ API design ให้มันถูกต้องอย่างสม่ำเสมอ 

โดย เริ่มต้นฟังก์ชัน `createContainer()` , คุณสามารถใช้ Hooks แบบกำหนดเองได้ "containers" และมี API คอยเตือนและ ป้องกันคุณจากการใช้งานผิดพลาด

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

นี่คือความแตกต่างของการเปลี่ยนแปลง :

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

หากคุณใช้ TypeScript (ซึ่งฉันขอแนะนำให้คุณเรียนรู้เพิ่มเติม), สิ่งนี้ยังมีประโยชน์ในการสร้าง TypeScript เพื่อสามารถนำไปต่อยอดของทำงานได้ดีขึ้น.

## เทคนิค

### เทคนิค #1: Composing Containers

เพราะ เราสามารถทำงานกับ React hooks แบบกำหนดเองได้, เราสามารถเขียนคอนเทนเนอร์ภายใน hooks อื่นๆ ได้

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

### เทคนิค #2: Keeping Containers Small

สิ่งนี้มีประโยชน์ในการเก็บในค่าไว้ใน containers เล็กและชัดเจน. ซึ่งมันเป็นสิ่งสำคัญ ถ้าคุณต้องการทำ code split กับ logic ใน containers ของคุณ : แค่ย้ายทั้งหมดไปที่ own hooks และ เก็บค่า state ไว้ใน containers.

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

### เทคนิค #3: Optimizing components

ไม่มี "การเพิ่มประสิทธิภาพ" ใน `unstated-next` , เพราะ React ทำการเพิ่มประสิทธิภาพไว้ให้อยู่แล้ว

#### 1) เพิ่มประสิทธิภาพโดย splitting component ออกเป็นส่วนๆ

**ก่อน:**

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

**หลัง:**

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

#### 2) เพิ่มประสิทธิภาพด้วย useMemo()

**ก่อน:**

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

**หลัง:**

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

#### 3) ลดการ re-renders โดยใช้ React.memo() และ useCallback()

**ก่อน:**

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

**หลัง:**

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

#### 4) ครอบ elements ของคุณด้วย `useMemo()`

[via Dan Abramov](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**ก่อน:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return (
    <p>You clicked {count} times</p>
  )
}
```

**หลัง:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return useMemo(() => (
    <p>You clicked {count} times</p>
  ), [count])
}
```

## สิ่งนี้สัมพันธ์กับ Unstated

สิ่งนี้โดยสืบทอดมาจาก [Unstated](https://github.com/jamiebuilds/unstated). ฉันสร้าง Unstated เพราะฉันเชื่อว่า React ยอดเยี่ยมมาก ในเรื่องของการจัดการ state อยู่แล้ว และ สิ่งที่ขาดหายไปเพียงอย่างเดียวคือ sharing state และ logic อย่างง่าย. ดังนั้น ฉันสร้าง Unstated เพื่อให้มัน "minimal" ที่สุด และ จะสามารถจัดการเรื่อง sharing React state และ logic.

อย่างไรก็ตาม, โดย React Hooks เคลมว่า จะสามารถจัดการ sharing state and logic ได้ดีมากยิ่งขึ้น. จนถึงจุดที่ฉันคิดว่า Unstated ได้กลายเป็นสิ่งที่ไม่จำเป็นแล้ว.

**อย่างไรก็ตาม**, ฉันคิดว่านักพัฒนาซอฟต์แวร์หลายคนดิ้นรน เพื่อดูว่า share state และ logic ทำอย่างไร โดย React Hooks สำหรับ "application state". นั่นอาจเป็นปัญหาของ เอกสาร และ ชุมชน, แต่ฉันคิดว่า API สามารถช่วยเชื่อมโยงสิ่งนั้นได้ โดยอุดช่องว่างของปัญหาที่เกิดขึ้น.

API นั้นคืออะไร Unstated Next. แทนที่จะเป็น "Minimal API for sharing state and logic in React", ตอนนี้มันเป็น "Minimal API for understanding shared state and logic in React".

แทนที่จะใช้ Unstated, คุณแค่ต้องการใช้ React, ฉันขอแนะนำว่า. ควรจะเขียนบล็อกเกี่ยวกับสิ่งนั้น !! และ กระจายความรู้ เพื่อเป็นทำให้เกิด community ที่ดีขึ้น

## ย้ายจาก `unstated`

ฉันตั้งใจเผยแพร่ นี่เป็นแพ็คเกจแยกต่างหาก เพราะ เป็นการรีเซ็ตที่สมบูรณ์ใน API. วิธีนี้คุณสามารถมีทั้งการติดตั้งและ ย้ายมา เพื่อใช้งานแบบเป็นค่อยไป ทีละ Component.

โปรดให้ข้อเสนอแนะกับฉัน เกี่ยวกับกระบวนการย้ายมาใช้งาน เพราะในอีกไม่กี่เดือนข้างหน้าฉันหวังว่าจะรับข้อเสนอแนะนั้นและ ทำสองสิ่ง:

- ตรวจสอบให้แน่ใจ `unstated-next` ตอบสนองทุกความต้องการของผู้ใช้งาน `unstated`.
- ตรวจสอบให้แน่ใจ `unstated` มีกระบวนการโยกย้ายมาใช้งานที่ clean `unstated-next`.

ฉันอาจเลือกที่จะเพิ่ม API ทั้ง library เพื่อทำให้นักพัฒนา ทำงานได้ง่ายขึ้น. สำหรับ `unstated-next` ฉันสัญญาว่า API ที่เพิ่มจะน้อยที่สุดเท่าที่จะเป็นไปได้ และ ฉันจะพยายามจะเก็บ library ให้มีขนาดเล็กที่สุด.

ในอนาคต, ฉันคิดว่าจะรวม `unstated-next` เข้าไปใน `unstated` ที่เป็นเวอร์ชันหลักในตอนนี้. `unstated-next` จะยังคงอยู่เพื่อให้คุณสามารถติดตั้งทั้ง `unstated@2` และ `unstated-next` ได้. จากนั้นเมื่อทำการโยกย้ายเสร็จ คุณสามารถอัปเดตเป็น`unstated@3` และ จะลบ `unstated-next`

แม้ว่านี่เป็นการเปลี่ยนแปลง API ใหม่ที่สำคัญ, ฉันหวังว่าฉันจะทำให้การย้ายครั้งนี้เป็นเรื่องง่ายที่สุดสำหรับคุณ. ฉันจะปรับให้เหมาะสม เพื่อให้คุณใช้งานได้ React Hooks APIs และ ไม่ใช่สำหรับ preserving code ที่เขียนด้วย `Unstated.Container`. และ อย่าลังเลที่จะให้ข้อเสนอแนะเกี่ยวกับวิธีการที่สามารถทำได้ดีกว่าวิธีการที่ฉันคิดไว้