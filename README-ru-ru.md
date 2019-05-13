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

> 200 байт, чтобы навсегда забыть о библиотеках для управления состоянием React-компонентов

- **React-хуки**: _это все, что нужно для управления состоянием._
- **~200 байт**, _min+gz._
- **Знакомый API**: _просто пользуйтесь React, как обычно._
- **Минимальный API**: _хватит пяти минут, чтобы разобраться._
- **Написан на TypeScript**, _чтобы обеспечить автоматический вывод типов в коде ваших компонентов React._

Главный вопрос: чем он лучше, чем Redux? Ну...

- **Он меньше.** _Он в 40 раз меньше._
- **Он быстрее.** _Изолируйте проблемы производительности на уровне компонентов._
- **Он проще в изучении.** _Вам в любом случае нужно уметь пользоваться React-хуками и контекстом, они классные._
- **Он проще в интеграции.** _Подключайте по одному компоненту за раз, не ломая совместимости с другими React-библиотеками._
- **Он проще в тестировании.** _Тестировать отдельно редьюсеры — напрасная трата времени, тестируйте сами React-компоненты._
- **Он проще с точки зрения типизации.** _Написан так, чтобы максимально задействовать выведение типов._
- **Он минималистичный.** _Это просто React._

Вам решать.

### [См. также: миграция с Unstated &rarr;](#миграция-с-unstated)

## Установка

```sh
npm install --save unstated-next
```

## Пример

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

## Руководство

Если вы пока не знакомы с React-хуками, рекомендую прервать чтение и ознакомиться с
[прекрасной документацией на сайте React](https://reactjs.org/docs/hooks-intro.html).

Итак, с помощью хуков вы можете написать что-нибудь вроде такого компонента:

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

Если логику компонента требуется использовать в нескольких местах, ее можно вынести
в отдельный кастомный хук:

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

Но что делать, когда вам требуется общее состояние, а не только логика?
Здесь пригодится контекст:

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

Это замечательно и прекрасно; чем больше людей будет писать в таком стиле, тем лучше.

Однако стоит внести еще чуть больше структуры и ясности, чтобы API предельно четко выражал ваши намерения.

Для этого мы добавили функцию `createContainer()`, чтобы можно было рассматривать ваши кастомные хуки как "контейнеры", чтобы наш четкий и ясный API просто невозможно было использовать неправильно.

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

Сравните текст компонента до и после наших изменений:

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

Если вы пишете на TypeScript (а если нет — настоятельно рекомендую ознакомиться с ним), вы ко всему прочему получаете более качественный вывод типов. Если ваш кастомный хук строго типизирован, вывод всех остальных типов сработает автоматически.

## Советы

### Совет #1: Объединение контейнеров

Поскольку мы имеем дело с кастомными хуками, мы можем объединять контейнеры внутри других хуков.

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

### Совет #2: Используйте маленькие контейнеры

Контейнеры лучше всего делать маленькими и четко сфокусированными на конкретной задаче. Если вам нужна дополнительная бизнес-логика в контейнерах — выносите новые операции в отдельные хуки, а состояние пусть хранится в контейнерах.

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

### Совет #3: Оптимизация компонентов

Не существует никакой отдельной "оптимизации" для `unstated-next`, достаточно обычных приемов оптимизации React-компонентов.

#### 1) Оптимизация тяжелых поддеревьев с помощью разбиения компонентов на части.

**До:**

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
            <div>СУПЕР НАВОРОЧЕННОЕ ПОДДЕРЕВО КОМПОНЕНТОВ</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**После:**

```js
function ExpensiveComponent() {
  return (
    <div>
      <div>
        <div>
          <div>СУПЕР НАВОРОЧЕННОЕ ПОДДЕРЕВО КОМПОНЕНТОВ</div>
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

#### 2) Оптимизация тяжелых операций с помощью хука useMemo()

**До:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // Вычислять выражение каждый раз, когда обновляется `counter` — слишком медленно
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

**После:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // Пересчитываем значение только тогда, когда входные данные изменились
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

#### 3) Снижаем количество повторных рендеров с помощью React.memo() and useCallback()

**До:**

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

**После:**

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

## Отношение к Unstated

Я рассматриваю данную библиотеку как духовного преемника [Unstated](https://github.com/jamiebuilds/unstated). Я сделал Unstated, поскольку был убежден, что React и сам превосходно справлялся с управлением состоянием, и ему не хватало только простого механизма для разделения общего состояния и логики. Поэтому я создал Unstated как "минимальное" решение для данной проблемы.

С появлением хуков React стал гораздо лучше в плане выделения общего состояния и логики. Настолько лучше, что, с моей точки зрения, Unstated стал излишней абстракцией.

**ТЕМ НЕ МЕНЕЕ**, я считаю, что многие разработчики слабо представляют, как разделять логику и общее состояние приложения с помощью React-хуков. Это может быть связано просто с недостаточным качеством документации и инерцией сообщества, но я полагаю, что четкий API как раз способен исправить этот недостаток.

Unstated Next и есть этот самый API. Вместо того, чтобы быть "Минимальным API для разделения общего состояния и логики в React", теперь он "Минимальный API для понимания, как разделять общее состояние и логику в React".

Я всегда был на стороне React, и я хочу, чтобы React процветал. Я бы предпочел, чтобы сообщество отказалось от использования библиотек для управления состоянием наподобие Redux, и начало наконец в полную силу использовать встроенные в React инструменты.

Если вместо того, чтобы использовать Unstated, вы будете просто использовать React — я буду это только приветствовать. Пишите об этом в своих блогах! Выступайте об этом на конференциях! Делитесь своими знаниями с сообществом.

## Миграция с `unstated`

Я нарочно публикую эту библиотеку как отдельный пакет, потому что весь API полностью новый. Поэтому вы можете параллельно установить оба пакета и мигрировать постепенно.

Поделитесь своими впечатлениями о переходе на `unstated-next`, потому что в течение нескольких следующих месяцев я планирую на базе этой информации сделать две вещи:

- Убедиться, что `unstated-next` удовлетворяет все нужды пользователей `unstated`.
- Удостовериться, что для `unstated` есть четкий и ясный процесс миграции на `unstated-next`.

Возможно, я добавлю какие-то API в старую или новую библиотеку, чтобы упростить жизнь разработчикам. Что касается `unstated-next`, я обещаю, что добавленные API будут минимальными, насколько это возможно, и я приложу все усилия, чтобы библиотека осталась маленькой.

В будущем, я, вероятно, перенесу код `unstated-next` обратно в `unstated` в качестве новой мажорной версии. `unstated-next` будет по-прежнему доступен, чтобы можно было параллельно пользоваться `unstated@2` и `unstated-next` в одном проекте. Затем, когда вы закончите миграцию, вы сможете обновиться до версии `unstated@3` и удалить `unstated-next` (разумеется, обновив все импорты... поиска и замены должно быть достаточно).

Несмотря на кардинальную смену API, я надеюсь, что смогу обеспечить вам максимально простую миграцию, насколько это вообще возможно. Я оптимизирую процесс с точки зрения использования самых последних API React-хуков, а не с точки зрения сохранения кода, написанного с использованием `Unstated.Container`-ов. Буду рад любым замечаниям о том, что можно было бы сделать лучше.
