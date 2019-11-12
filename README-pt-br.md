<p align="right">
  <strong>
    <a href="README.md">English</a> |
    <a href="README-zh-cn.md">中文</a> |
    <a href="README-ru-ru.md">Русский</a> |
    <a href="README-th-th.md">ภาษาไทย</a> |
    <a href="README-vi-vn.md">Tiếng Việt</a> |
    <a href="README-pt-br.md">Português</a>
  </strong>
  <br/>
  <sup><em>(Por favor, contribua com traduções!)</em></sup>
</p>

# Unstated Next

> 200 bytes para nunca mais pensar em bibliotecas de gerenciamento de estado em React

- **React Hooks** _use-os para toda a sua gestão de estado._
- **~200 bytes** _min+gz._
- **API Familiar** _basta usar o React como pretendido._
- **API Mínima** _leva 5 minutos para aprender._
- **Escrito em TypeScript** _e facilitará a digitação do seu código em React._

Mas, a pergunta mais importante: É melhor que o Redux? Bem...

- **É menor.** _É 40x menor._
- **É mais rápido.** _Componentize o problema de desempenho._
- **É mais fácil de aprender.** _Você já precisará conhecer React Hooks & Context, basta usá-los, eles são demais._
- **É mais fácil de integrar.** _Integre um componente por vez, e integre-se facilmente a todas as bibliotecas React._
- **É mais fácil de testar.** _Testar redutores é uma perda de tempo, facilite os testes dos componentes React._
- **É mais fácil digitar.** _Projetado para tornar inferível a maioria dos seus tipos._
- **É mínimo.** _É apenas React._

Você decide.

### [Consulte a migração na documentação do Unstated &rarr;](#migra%C3%A7%C3%A3o-de-unstated)

## Instalar

```sh
npm install --save unstated-next
```

## Exemplo

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

Se você nunca usou o React Hooks antes, recomendo pausar e ler a [excelenete documentação no site do React](https://reactjs.org/docs/hooks-intro.html).

Portanto, com os hooks você pode criar um componente como este:

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

Então, se você quiser compartilhar a lógica por trás do componente, poderá extrai-lo em um hook customizado:

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

Mas e se você quiser compartilhar o estado além da lógica, o que você faz?

É aqui que o contexto entra em jogo:

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

Isso é ótimo, é perfeito, mais pessoas devem escrever um código como este.

Às vezes, porém, todos precisamos de um pouco mais de estrutura e design intencional de API para obter a consistência correta.

Introduzindo a função `createContainer()`, você pode pensar nos seus hooks customizados como "contêineres" e ter uma API clara, impedindo que você a use incorretamente.

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

Aqui está o diff dessa mudança:

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

Se você estiver usando o TypeScript (sobre o qual encorajo você a aprender mais, se não estiver), isso também terá o benefício de tornar a inferência incorporada do TypeScript funcionar melhor. Desde que seu hook customizado seja digitado, todo o resto funcionará.

## Dicas

### Dica #1: Compondo containers

Como estamos trabalhando apenas com React Hooks customizados, podemos compor contêineres dentro de outros hooks:

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

### Dica #2: Mantendo os contêineres pequenos

Isso pode ser útil para manter seus contêineres pequenos e focados. O que pode ser importante se você quiser codificar a lógica em seus contêineres: basta movê-los para seus próprios hooks e manter apenas o estado nos contêineres.

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

### Dica #3: Otimizando componentes

Não há "otimização" no `unstated-next` a ser feita, todas as otimizações que você pode fazer seriam otimizações padrões do React.

#### 1) Otimizando subárvores caras dividindo o componente

**Antes:**

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

**Depois:**

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

#### 2) Otimizando operações caras com useMemo()

**Antes:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // Recalcular isso sempre que o `counter` mudar é caro
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

**Depois:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // Recalcule esse valor apenas quando suas entradas forem alteradas
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

#### 3) Reduzindo as re-renderizações usando React.memo() e useCallback()

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

**Depois:**

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

#### 4) Envolvendo seus elementos com `useMemo()`

[via Dan Abramov](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**Antes:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return (
    <p>You clicked {count} times</p>
  )
}
```

**Depois:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return useMemo(() => (
    <p>You clicked {count} times</p>
  ), [count])
}
```

## Relação com Unstated

Considero esta biblioteca o sucessor espiritual de [Unstated](https://github.com/jamiebuilds/unstated). Criei o Unstated porque acreditava que o React já era realmente bom em gerenciamento de estado e a única peça que faltava era compartilhar estado e lógica facilmente. Então, criei Unstated para ser a solução "mínima" para compartilhar o estado e a lógica do React.

No entanto, com Hooks, o React se tornou muito melhor no compartilhamento de estado e lógica. A tal ponto que acho que Unstated se tornou uma abstração desnecessária.

**NO ENTANTO**, acho que muitos desenvolvedores tiveram dificuldades em saber como compartilhar estado e lógica com o React Hooks para o "estado do aplicativo". Isso pode ser apenas uma questão de documentação e momento da comunidade, mas acho que uma API pode ajudar a preencher essa lacuna mental.

Essa API é o que é o Unstated Next. Em vez de ser a "API mínima para compartilhar estado e lógica no React", agora é a "API mínima para entender o estado e a lógica compartilhada no React".

Eu sempre estive do lado do React. Eu quero que o React ganhe. Gostaria de ver a comunidade abandonando as bibliotecas de gerenciamento de estado, como o Redux, e encontrar melhores maneiras de user a cadeia de ferramentas integradas do React.

Se, em vez de usar o Unstated, você quiser apenas usar o React, eu super encorajaria. Escreva postagens de blog sobre isso! Dê palestras sobre isso! Espalhe seu conhecimento na comunidade.

## Migração de `unstated`

Publiquei intencionalmente com um nome de pacote separado, porque é uma redefinição completa na API. Dessa forma, você pode ter ambos instalados e migrar de forma incremental.

Envie-me um feedback sobre esse processo de migração, porque, nos próximos meses, espero receber esse feedback e fazer duas coisas:

- Me certificar de que `unstated-next` atenda a todas as necessidades dos usuários `unstated`.
- Me certificar de que `unstated` tenha um processo de migração limpo para `unstated-next`.

Posso optar por adicionar APIs a qualquer uma das bibliotecas para facilitar a vida dos desenvolvedores. Para `unstated-next`, prometo que as APIs adicionadas serão o mínimo possível e tentarei manter a biblioteca pequena.

No futuro, provavelmente mesclarei `unstated-next` de volta em `unstated` como uma nova versão principal. O `unstated-next` ainda existirá para que você possa ter o `unstated@2` e o `unstated-next` instalados. Então, quando você terminar a migração, poderá atualizar para `unstated@3` e remover `unstated-next` (certifique-se de atualizar todas as suas importações como faz ... deve ser apenas um encontrar e substituir).

Embora essa seja uma nova e importante mudança na API, espero poder facilitar essa migração o máximo possível. Estou otimizando para você usar as mais recentes APIs do React Hooks e não para preservar o código escrito com o `Unstated.Container`. Sinta-se à vontade para fornecer feedback sobre como isso pode ser melhor feito.
