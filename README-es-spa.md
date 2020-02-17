<p align="right">
  <strong>
    <a href="README.md">English</a> |
    <a href="README-zh-cn.md">中文</a> |
    <a href="README-ru-ru.md">Русский</a> |
    <a href="README-th-th.md">ภาษาไทย</a> |
    <a href="README-vi-vn.md">Tiếng Việt</a> |
    <a href="README-es-spa.md">Español</a>
  </strong>
  <br/>
  <sup><em>(Please contribute translations!)</em></sup>
</p>

# Unstated Next

> 200 bytes para no pensar nunca más en las bibliotecas de administración de estado React

- **React Hooks** _úsalos para toda la gestión de tu state._
- **~200 bytes** _min+gz._
- **API familiar** _use React como se pretende._
- **API minimalista** _te tardas 5 minutos en aprender._
- **Escrito en TypeScript** _se te facilitará escribir tu código React._

Pero, la pregunta más importante: ¿Es esto mejor que Redux? Bueno...

- **Es pequeño.** _Es 40 veces más pequeña._
- **Es rápida.** _Componentizar el problema del desempeño._
- **Es fácil de aprender.** _Ya tendrás que conocer React Hooks & Context, solo úsalos, son geniales._
- **Es fácil de integrar.** _Integre un componente a la vez e integre fácilmente con cada libería de React._
- **Es fácil de testear.** _Probar los reducers es una pérdida de tiempo, hace que sea más fácil probar sus componentes React._
- **Es más fácil de revisar tipos.** _Diseñado para hacer que la mayoría de sus tipos sean inferibles._
- **Es minimalista.** _It's just React._

Así que tu decides.

### [Docs para migrarte desde Unstated &rarr;](#migrando-desde-unstated)

## Instalación

```sh
npm install --save unstated-next
```

## Ejemplo

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

## Guía

Si nunca antes has usado React Hooks, te recomiendo pausar e ir a leer
[los excelentes documentos en el sitio React](https://reactjs.org/docs/hooks-intro.html).

Entonces, con Hooks, puede crear un componente como este:

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

Luego, si desea compartir la lógica detrás del componente, puede extraerlo
en un hook personalizado:

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

Pero, ¿Qué pasa si quieres compartir el estado además de la lógica, qué haces?

Aquí es donde entra en juego el context:

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

Esto es genial, es perfecto, más personas deberían escribir código como este.

Pero a veces todos necesitamos un poco más de estructura y diseño de API intencional para hacerlo de manera consistente.

Al introducir la función `createContainer()`, puede pensar en sus hooks personalizados como "contenedores" y tener una API que es clara y evita que lo use incorrectamente.

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

Aquí está la diferencia de ese cambio:

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

Si está utilizando TypeScript (que te animo a que lo aprendas si no estás en eso), esto también tiene la ventaja de hacer que la inferencia incorporada de TypeScript funcione mejor. Mientras se escriba su hook personalizado, todo lo demás simplemente funcionará.

## Tips

### Tip #1: Contenedores de composición

Debido a que solo estamos trabajando con React Hooks personalizados, podemos componer contenedores dentro de otros hooks.

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

### Tip #2: Mantener contenedores pequeños

Esto puede ser útil para mantener sus contenedores pequeños y enfocados. Lo que puede ser importante si desea codificar dividir la lógica en sus contenedores: simplemente muévalos a sus propios Hooks y mantenga solo el estado en los contenedores.

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

### Tip #3: Optimizando componentes

No hay que hacer "optimización" de `unstated-next`, todas las optimizaciones que podría hacer serían optimizaciones estándar de React.

#### 1) Optimización de sub-árboles caros al dividir el componente

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

**Después:**

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

#### 2) Optimizando operaciones costosas con useMemo()

**Antes:**

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

**Despúes:**

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

#### 3) Reducción de renders usando React.memo() y useCallback()

**Antes:**

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

**Después:**

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

#### 4) Envolviendo tus elementos con `useMemo()`

[vía Dan Abramov](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**Antes:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count

  return <p>You clicked {count} times</p>
}
```

**Después:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count

  return useMemo(() => <p>You clicked {count} times</p>, [count])
}
```

## Relación con Unstated

Considero que esta biblioteca es el sucesor espiritual de [Unstated](https://github.com/jamiebuilds/unstated). Creé Unstated porque creía que React ya era realmente bueno en la gestión del estado y que la única pieza que faltaba era compartir el estado y la lógica fácilmente. Así que creé Unstated para ser la solución "mínima" para compartir el estado y la lógica de React.

Sin embargo, con Hooks, React se ha vuelto mucho mejor para compartir estado y lógica. Hasta el punto de que creo que Unstated se ha convertido en una abstracción innecesaria.

**SIN EMBARGO**, Creo que muchos desarrolladores han tenido dificultades para ver cómo compartir el estado y la lógica con React Hooks para el "estado de la aplicación". Eso puede ser solo un problema de documentación e impulso de la comunidad, pero creo que una API podría ayudar a cerrar esa brecha mental.

Esa API es lo que es Unstated Next. En lugar de ser la "API mínima para compartir el estado y la lógica en React", ahora es la "API mínima para comprender el estado y la lógica compartidos en React".

Siempre he estado del lado de React. Quiero que React gane. Me gustaría ver a la comunidad abandonar las bibliotecas de administración estatal como Redux, y encontrar mejores formas de hacer uso de la cadena de herramientas incorporada de React.

Si en lugar de usar Unstated, solo quieres usar React en sí, lo recomendaría encarecidamente. ¡Escribe publicaciones de blog al respecto! ¡Da charlas al respecto! Difundir su conocimiento en la comunidad.

## Migrando desde `unstated`

He publicado esto intencionalmente como un nombre de paquete separado porque es un restablecimiento completo en la API. De esta manera, puede instalar y migrar de forma incremental.

Envíenme sus comentarios sobre ese proceso de migración, porque en los próximos meses espero recibir esos comentarios y hacer dos cosas:

- Asegurarse que `unstated-next`cumple todas las necesidades de los usuarios de `unstated`.
- Asegurarse que `unstated` tiene un proceso de migración limpio hacia `unstated-next`.

Puedo elegir agregar API a cualquiera de las bibliotecas para facilitar la vida de los desarrolladores. Para `unstated-next` Prometo que las API agregadas serán lo más mínimas posible e intentaré mantener la biblioteca pequeña.

En el futuro, probablemente me fusionaré `unstated-next` dentro de `unstated` como una actualización mayor de versión. `unstated-next` seguirá existiendo para que pueda tener ambos `unstated@2` y `unstated-next` instalados. Luego, cuando haya terminado con la migración, puede actualizar a `unstated@3` y remover `unstated-next`(asegúrese de actualizar todas sus importaciones como lo hace ... debería ser solo una búsqueda y reemplazo).

A pesar de que este es un nuevo cambio importante de API, espero poder hacer esta migración lo más fácil posible para usted. Estoy optimizando para que puedas usar las últimas API de React Hooks y no para preservar el código escrito con `Unstated.Container`'s. Siéntase libre de proporcionar comentarios sobre cómo podría hacerse mejor.
