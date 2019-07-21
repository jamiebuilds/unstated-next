<p align="right">
  <strong>
    <a href="README.md">English</a> |
    <a href="README-zh-cn.md">中文</a> |
    <a href="README-ru-ru.md">Русский</a> |
    <a href="README-th-th.md">ภาษาไทย</a> |
    <a href="README-vi-vn.md">Tiếng Việt</a>
    <a href="README-ja.md">日本語</a>
  </strong>
  <br/>
  <sup><em>(Please contribute translations!)</em></sup>
</p>

# Unstated Next

> Reactの状態管理ライブラリについて二度と考えないための200バイト

- **React Hooks** _すべての状態管理に使いましょう。_
- **~200バイト** _min+gz._
- **慣れ親しんだAPI** _普段通りにReactを使うだけです。_
- **最小限のAPI** _学習時間は５分です。_
- **TypeScriptで書かれています** _そのため、Reactのコードに型を付けやすいです。_

しかし、最も重要な質問があります： Reduxより優れているのか？　それは…
- **もっと小さく** _40倍小さいです。_
- **もっと高速に** _パフォーマンスの問題をコンポーネント化します。_
- **もっと学習しやすく** _すでにReact HooksとContextを知る必要があり、ただそれらを使うだけです。_
- **もっと統合しやすく** _一つのコンポーネントを一度で統合できます。そしてすべてのReactライブラリと簡単に統合できます。_
- **もっとテストしやすく** _reducerをテストすることは無駄です。もっと簡単にReactコンポーネントをテストできます。_
- **もっと型チェックしやすく** _型のほとんどを推論できるように設計しています。_
- **最小限に** _それがReactです。_

そう、決めるのはあなたです。

### [Unstatedからの移行のドキュメント &rarr;](#migration-from-unstated)

## インストール

```sh
npm install --save unstated-next
```

## 例

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

もしこれまでにReact Hooksを使ったことが無ければ、一旦停止し [the excellent docs on the React site](https://reactjs.org/docs/hooks-intro.html)を読むことを推奨します。

hooksを使ってこのようなコンポーネントをあなたは作ったことがあるかもしれないです：

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

その後、もしコンポーネントの中のロジックを共有したい場合は、カスタムhooksにすることができます：

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

しかしロジックだけではなく状態を共有したい場合、どうしますか？

そのような場合はContextの出番です。

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

素晴らしい。完璧です。多くの人がこのようにコードを書くべきです。

しかし、私達はもう少し構造的で意図的なAPIを設計する必要があります。そうすれば一貫して正しいAPIを扱うことができます。

`createContainer()` 関数を紹介します。これを使えば「コンテナー(containers)」としてカスタムhooksを考慮でき、明確なAPIが使えて間違った使い方をすることを防ぐことができます。

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

以下は変更の差分です。

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

もしTypeScriptを使っている場合（もし使っていないなら使うことをおすすめします）、TypeScriptに組み込まれた型推論の恩恵を受けることができます。あなたのカスタムhookが型付けされていれば、その他の型はすべては正しく動作します。

## Tips

### Tip #1: コンテナを構成する

カスタムReact hooksを使っているだけなので、他のhooksの内部にコンテナを構成することができます。

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

### Tip #2: コンテナを小さく保つ

このTipsはコンテナを小さく焦点を絞ることを保つために役立ちます。コンテナ内のロジックのコードを分割したい場合に重要になるかもしれません：
個別のhooksに移動させコンテナ内で状態を保つだけです。

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

### Tip #3: コンポーネントの最適化

"unstated-next"を実行するための「最適化」は行われていません。あなたが行ったかもしれないすべての最適化は標準のReactの最適化でした。

#### 1) コンポーネントを部分ごとに分割することで高コストなサブツリーを最適化します

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

#### 2) useMemo()を使って高コストなオペレーションを最適化します

**Before:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()

  // `counter`が変わるたびに再計算することは高コストです
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

#### 3) React.memo()とuseCallback()を使って再レンダリングを減らします

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

#### 4) `useMemo()`を使って要素をラップします

[Dan Abramov氏より](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

**Before:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return (
    <p>You clicked {count} times</p>
  )
}
```

**After:**

```js
function CounterDisplay(props) {
  let counter = Counter.useContainer()
  let count = counter.count
  
  return useMemo(() => (
    <p>You clicked {count} times</p>
  ), [count])
}
```

## Unstatedとの関連性

私はこのライブラリは[Unstated](https://github.com/jamiebuilds/unstated)の精神を受け継いでいると考えています。Reactは既に状態管理にとても優れており、唯一の欠点は状態とロジックの共有だとと信じていたためUnstatedを作りました。そのためReactの状態とロジックを共有するのに「最小限」の解決方法になるようにUnstatedを作りました。

しかし、Hooksを使えばReactは状態とロジックを共有するのにもっと良くなります。

**しかし**、多くの開発者は「アプリケーション内の状態」のためにReact Hooksを使って状態とロジックをどのように共有するか考えることに苦労していると私は考えました。

Unstated NextこそがそのAPIです。「React内で状態とロジックの共有のための最小限のAPI」にするのではなく、「React内で共有されている状態ととロジックを理解するための最小限のAPI」としています。

私はいつもReactの味方でした。Reactに勝利してほしいです。コミュニティがReduxのような状態管理ライブラリを捨て、Reactに組み込まれているツールチェインを使うより良い方法を探したいと考えています。

もしUnstatedを使わずにReact本体だけを使いたいのであれば、私はそれを強く推奨します。それについてブログを書いてください！　それについて話してください！　コミュニティにあなたの知識を広めてください。

## `unstated`からの移行

これはAPIを完全にリセットしているため、意図的に別のパッケージ名として公開しました。これにより、双方をインストールして段階的に移行することができます。

移行プロセスについてフィードバックをください。今後数ヶ月の間にフィードバックを集めて下記の2つを行いたいと考えています。

- `unstated-next`が`unstated`のユーザーの要求を満たしているか確認
- `unstated`の`unstated-next`への移行プロセスが整っているか確認

私は開発者の負担を軽減するためにどちらかのライブラリにAPIを追加することもできます。`unstated-next`については、追加されるAPIは可能な限り最小になるようにすることを約束します。そしてライブラリを小さく保つようにします。

将来、`unstated-next`を`unstated`の新しいメジャーバージョンとしてマージするかもしれません。`unstated-next`は存在しつづけ、`unstated@2`もしくは`unstated-next`でインストールすることができるようにします。その後、移行が完了したら`unstated@3`にアップデートし`unstated-next`を削除することが可能になります。(ライブラリを読み込んでいる箇所をすべて修正していることを確認してください。行うことは検索と置換のみです）

これは主要な新しいAPIの変更ですが、可能な限り簡単に移行を行えることを願っています。最新のReact Hooks APIを使って`Unstated.Container`で書かれたコードを保守しなくてもいいように最適化しています。どうすればより良くなるか気軽にフィードバックしてください。
