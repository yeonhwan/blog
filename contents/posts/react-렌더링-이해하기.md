---
title: React 렌더링 이해하기
excerpt: "React와 렌더링 과정 이해하기"
date: 2025-05-27T04:20:47.031Z
publish: true
slug: react-렌더링-이해하기
tags: [React, UI]
---

<details>
  <summary>목차</summary>
    <a href="#jsx-와-vdom">JSX 와 VDOM</a>
    <a href="#jsx-와-vdom">React 시스템과 LifeCycle</a>
    <a href="#jsx-와-vdom">React Fiber</a>
    <a href="#jsx-와-vdom">Concurrent Rendering</a>
    <a href="#jsx-와-vdom">Server Side React</a>
</details>

# React 와 React 렌더링 이해하기

React를 사용해 어플리케이션 작성하다보면 화면에 표시되는 UI 들을 당연하게 받아들이곤 한다.

그런데 문득 어떤 과정들을 거쳐 내가 작성한 코드들이 UI 로 바뀌어 화면에 나타나고 있는지 생각해보면 머릿속이 복잡해지기 시작한다.

더군다나 React 18, 19 버전을 거쳐가며 새롭게 추가된 `Concurrent Rendering` 과 `Server Component` 등의 기능 들은 더욱 React 가 뒤편에서
사용자를 대신해 어떤 과정을 대신 해주고 있는지 직관적으로 파악하기 힘들게 만든다.
<br/>

> 그렇다면 어떤 과정들을 통해서 React 는 우리의 코드를 화면에 렌더링 하고 있는 것일까?

## JSX 와 VDOM

React 의 렌더링의 시작은 가장 간단한 코드를 React의 언어로 번역해보는 것부터 시작하는 게 좋을 것 같다.

```javascript title="MyList.jsx"
function MyList() {
  return (
    <main id="my-list">
      <h1>Hello! Things to buy</h1>
      <ul>
        <li>Milk</li>
        <li>Eggs</li>
      </ul>
    </main>
  );
}
```

일상적으로 사용하는 React의 코드는 생각해보면 Javascript 문법에 맞지 않는 형태를 하고 있다.

Javascript 의 구성 요소가 아닌 HTML 을 함수의 값으로 반환하고 있기 때문이다.

그렇다면 어떻게 우리는 오류 없이 HTML 을 Javascript 내에서 값으로 전달받고 전달하고, 오류 없이 의도한대로 화면에 보여줄 수 있는 것일까?

React 렌더링의 이해의 시작은 여기서 부터 시작된다.

### JSX

`JSX` 는 `Javascript XML(Extensible Markup Language)` 의 약자로 Javscript의 기능을 확장해 Markup 언어를 Javascript 와 함께 사용할 수 있도록
한 확장 구문이라고 할 수 있다.

앞서 이야기한 것 처럼 `JSX` 는 Javascript 의 문법을 벗어나고 있기 때문에 우리는 `JSX` 를 Javscript 로 변환해주는 과정을 거쳐야한다.

이 과정을 트랜스파일 한다고 이야기 하며 `Babel` 과 같은 트랜스파일러나 현대적인 프레임워크들은 자체 적인 솔루션 `SWC, ES-Build` 등을
사용해 처리한다.

앞서 작성한 코드는 다음과 같이 트랜스파일러를 통해 Javscript로 변환된다.

```javascript title="MyList.js"
import React from "react";

//예시를 위해 이전 버전의 트랜스파일 결과물 사용
function MyComponent() {
  return React.createElement(
    "main",
    { id: "my-list" },
    React.createElement("h1", null, "Hello! Things to buy"),
    React.createElement(
      "ul",
      null,
      React.createElement("li", null, "Milk"),
      React.createElement("li", null, "Eggs"),
    ),
  );
}
```

결과물에서 `JSX` 는 `createElement` 라는 하나의 함수로 변환되어서 Javscript 내에서 사용된다는 것을 확인할 수 있다.

### React Element

`React.createElement` 를 살펴보면 함수 시그니처가 `createElement(type, props, ...children)`이고 반환 값이 `React Element` 객체라는 것을 확인할 수 있는데, 여기서 `type` 은 HTML 요소의 타입, `props` 는 요소가 지니고 있어야할 프로퍼티, `children` 은 해당 요소가 지니고 있는 자식 요소들이다.

그런데 `React Element` 라는 것은 뭘까? 이를 위해서 실제 `createElement` 함수의 결과를 살펴보자.

```javascript title="resultCreateElement.js"
{
  '$$typeof': Symbol(react.element),
  type: 'main',
  key: null,
  props: {
    id: 'my-list',
    children: [
      {
        '$$typeof': Symbol(react.element),
        type: 'h1',
        key: null,
        props: { children: 'Hello! Things to buy' },
        _owner: null,
        _store: {}
      },
      {
        '$$typeof': Symbol(react.element),
        type: 'ul',
        key: null,
        props: {
          children: [
            //... 생략
          ]
        },
        _owner: null,
        _store: {}
      }
    ]
  },
  _owner: null,
  _store: {}
}
```

결과를 살펴보면 이전에 `createElement` 를 통해 전달했던 값들을 통해 일종의 `DOM` 과 비슷한 Object 트리를 형성하는 것을 확인할 수 있다.

즉, `HTML -> DOM` 과정을 통해 Javascript 로 사용할 준비를 마치듯이 `JSX -> React Element Tree` 를 통해 React 가 동작할 재료를 마련하는 것이라고 볼 수 있다.

### VDOM

<br/>
<br/>

_전문가를 위한 React_ 의 핵심 내용과 추가적인 부분들을 이해하기 위해서 작성되었습니다.
