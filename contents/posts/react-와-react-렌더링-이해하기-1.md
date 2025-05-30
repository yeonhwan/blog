---
title: React 와 렌더링(1) - 렌더링 과정 이해하기
excerpt: "React와 렌더링 과정 이해하기"
date: 2025-05-27T04:20:47.031Z
publish: true
slug: react-와-react-렌더링-이해하기-1
tags: [React, UI]
---

<details>
  <summary>목차</summary>
    <a href="#렌더링의-시작">렌더링의 시작</a>
    <a href="#재조정">재조정</a>
    <a href="#fiber와-더블-버퍼링">Fiber와 더블 버퍼링</a>
    <a href="#render-와-commit">Render 와 Commit</a>
</details>

# 들어가며 

React를 사용해 어플리케이션 작성하다보면 화면에 표시되는 UI 들을 당연하게 받아들이곤 한다.

그런데 문득 어떤 과정들을 거쳐 내가 작성한 코드들이 UI 로 바뀌어 화면에 나타나고 있는지 생각해보면 머릿속이 복잡해지기 시작한다.

더군다나 React 18, 19 버전을 거쳐가며 새롭게 추가된 `Concurrent Rendering` 과 `Server Component` 등의 기능 들은 더욱 React 가 뒤편에서
사용자를 대신해 어떤 과정을 대신 해주고 있는지 직관적으로 파악하기 힘들게 만든다.

<br/>
> 그렇다면 어떤 과정들을 통해서 React 는 우리의 코드를 화면에 렌더링 하고 있는 것일까?
<br/>

가장 먼저 React 의 렌더링 과정부터 이해해보도록 하자.

## 렌더링의 시작

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

이 과정을 트랜스파일 한다고 이야기 하며 `Babel` 과 같은 트랜스파일러나 현대적인 프레임워크들은 자체 적인 솔루션이나 `SWC, ES-Build` 등을
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

즉, 우리가 `React Component` 를 사용한다는 것은 `createElement` 함수를 사용한다는 의미와 같다는 것을 알 수 있다.

그렇다면 `createElement` 함수는 무슨 역할을 하고, 함수의 결과물로는 어떤 값이 생성되는 걸까?

### React Element

`React.createElement` 를 살펴보면 함수 시그니처가 `createElement(type, props, ...children)`이고 반환 값이 `React Element` 객체라는 것을 확인할 수 있다.

여기서 `type` 은 HTML 요소의 타입, `props` 는 요소가 지니고 있어야할 프로퍼티, `children` 은 해당 요소가 지니고 있는 자식 요소들이다.

그런데 `React Element` 라는 것은 뭘까?
이를 위해서 실제 `createElement` 함수의 결과를 살펴보자.

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

즉, `HTML -> DOM` 파싱 과정을 통해 Javascript 로 사용할 준비를 마치듯이 `JSX -> React Element Tree` 의 트랜스파일링 과정을 통해 React 가 동작할 재료를 마련하는 것이라고 볼 수 있다.

### VDOM

이렇게 만들어진 React Element Tree 는 실제 DOM(Document Object Model)에 컴포넌트를 화면에 표시하기 위한 최소한의 정보를 담은 가볍고 추상적인 버전의 UI 표현이라고 할 수 있다.
React는 이렇게 생성된 React Element Tree를 바탕으로 내부적인 렌더링 작업을 시작한다.

웹 브라우저의 DOM을 직접 조작하는 것은 잦은 리플로우(reflow) 및 리페인트(repaint)를 발생시켜 성능 저하와 버벅임으로 이어질 수 있기 때문에,
React 는 DOM 을 조작하는 작업을 한 번에 처리하여 부수효과를 최대한 효과적으로 처리하고자 한다.

React 는 생성된 React Element Tree 를 바탕으로 필요한 작업들을 미리 기록하고 한 번에 처리하도록 하는 가상의 DOM 을 생성한다.

이러한 특징에서 `React Element Tree` 를 `VDOM (Virtual DOM)` 이라고 부르며, React 가 `VDOM` 을 사용해서 렌더링을 한다고 이야기한다.
VDOM은 실제 DOM의 복사본이라기보다는, 특정 시점의 UI 상태를 나타내는 추상적인 자바스크립트 객체 트리이자,
실제 DOM에 적용될 변경 사항을 미리 계산하고 준비하는 '가상적인' 표현이라고 이해할 수 있다.

<br/>

## 재조정

그렇다면 단순히 `VDOM` 을 사용하기 때문에 React 가 효과적으로 렌더링작업을 수행한다고 할 수 있는 것일까?

React 는 상태의 변경사항들을 효과적으로 일괄 처리, 변경사항들의 우선순위를 정하는 방법, 리렌더링의 부수효과를 처리해야하는 상황 등을
`재조정(Reconciliation)` 이라는 과정을 통해서 효과적으로 관리하고 있다.

React 의 렌더링 과정을 좀 더 자세하기 위해서는 재조정 과정을 이해하는 것이 필요하다.

### 재조정자

React가 VDOM을 통해 실제 DOM의 변경사항을 최소화하고 효율적인 렌더링 과정을 달성하는 것처럼, 
React 내부에서도 VDOM의 상태 변화를 효율적으로 비교하고 업데이트하는 방법을 재조정 과정을 통해 달성한다.

과거 React의 `재조정자(Reconciler)`는 내부적으로 스택(Stack) 기반의 알고리즘을 사용했다. 
이 알고리즘은 UI 업데이트 요청이 발생하면 VDOM (React Element Tree)의 변경 사항을 추적하기 위해,
새로운 React Element Tree 상의 필요한 모든 업데이트를 동기적으로 한 번에 처리했다.

그러나 이러한 스택 기반 알고리즘은 여러 업데이트 요청이 동시에 발생했을 때 렌더링 작업의 우선순위를 유동적으로 조절할 수 없었고,
무엇보다 렌더링 프로세스가 한번 시작되면 중간에 작업을 중단하거나 다른 긴급한 작업으로 전환할 수 없었다는 단점이 있었다.

가벼운 UI 요소들을 렌더링하는 데에는 문제가 되지 않았지만,
다음과 같이 리소스를 많이 필요로 하는 UI 의 요소들과 즉각적인 피드백이 중요한 요소들의 업데이트가 충돌할 경우 사용자의 인터랙션을 방해할 수 밖에 없다는 문제를 야기했다.

```javascript title="ExpensiveRendering.jsx"
import { useState } from "react";

const ExpensiveComponent = ({ data }) => {
  return (
    <div className="list">
      {data.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  );
};

const Form = () => {
  const [value, setValue] = useState("");
  // Exepensive State
  const [data, setData] = useState(Array.from({ length: 10000 }, (_, i) => i + 1));

  const handleChange = (e) => {
    setValue(e.target.value);
    setData(data.toReversed());
  };

  return (
    <form className="container">
      <label>Expensive</label>
      <input
        value={value}
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <ExpensiveComponent data={data} />
    </form>
  );
};

export default Form;
```

이 컴포넌트는 다음과 같은 문제를 야기한다.

1. `<ExpensiveComponent/> 는 렌더링 과정에서 리소스를 많이 소모한다.`
2. `<Form/>` 컴포넌트는 유저로부터 타이핑을 입력받아 즉각적으로 UI가 업데이트 될 것을 기대한다.
3. 그러나 키보드 입력에 의해 상태가 변경될 때마다 `<input/>` 요소 뿐만 아니라 `<ExpensiveComponent/>`가 같이 리렌더링 되면서 `<input/>` 요소의 다음 상호작용을 막는다.
4. 사용자는 화면에 키보드 입력이 지연되는 것처럼 느껴진다.

이러한 상황에서 스택 기반의 알고리즘의 `재조정자` 는 업데이트가 예정된 순서대로 그대로 진행되기 때문에
업데이트를 중단하거나 혹은 `<input/>` 요소의 업데이트를 우선순위로 둘 수 없었다.

실제 다양한 UI 요소들이 결합된 규모가 큰 어플리케이션에서 UI 의 렌더링의
중요도를 결정하고 이를 우선해 반영하는 적용하는 부분은 사용성에서 중요한 부분을 차지한다.

어떤 요소들은 즉각적인 반응을 요구하는데 비해 다른 요소들은 그렇지 않을 수 있기 때문이다.

이러한 문제를 해결해 사용성을 더 높이기 위해서 React 는 `React Fiber` 라는 새로운 아키텍쳐를 도입하기로 한다. 

## Fiber와 더블 버퍼링 

현재의 React 재조정자는 스택 기반의 알고리즘을 `React Fiber` 기반의 새로운 재조정 알고리즘으로 대체했다.

`React Fiber` 란 앞서 살펴본 `React Element` 를 기반으로 한 트리 자료구조를 말한다.

`React Fiber` 와 `React Element` 의 가장 큰 차이점은 `React Fiber` 자료구조가 `재조정자`가 렌더링을 관리하는데 사용하게 될
`React Element` 의 메타정보들이 포함된다는 사실이다.

`React Fiber Tree` 는 `React Fiber` 자료구조를 연결한 트리 자료구조이며, 
`React Fiber Node` 는 해당 트리의 하나의 노드이자 하나의 `React Element` 로부터 생성 된다.

### React Fiber

그렇다면 `React Fiber` 객체를 실제로 살펴보면서 어떠한 메타정보들이 포함되어 있는지 살펴보자.

다음은 간단한 React 코드와 그 결과물로 생성된 `React Fiber` 객체이다.

```javascript title="ReactFiber"

const Example = () => {
  return <main>Hello World!</main>
}

// <Example/> 속의 <main/> 요소의 result
// FiberNode
{
  "tag": 5,
  "key": null,
  "elementType": "main",
  "type": "main",
  "stateNode": {
    "__reactProps$zv8pdnmoao": {
      "children": "Hello World!"
    }
  },
  "return" : {...},
  "child": null,
  "sibling": null,
  "index": 0,
  "ref": null,
  "refCleanup": null,
  "updateQueue": null,
  "memoizedState": null,
  "dependencies": null,
  "mode": 27,
  "flags": 4,
  "subtreeFlags": 0,
  "deletions": null,
  "lanes": 0,
  "childLanes": 0,
  "actualDuration": 0,
  "actualStartTime": 41870.10000002384,
  "selfBaseDuration": 0,
  "treeBaseDuration": 0,
  "_debugInfo": null,
  "_debugNeedsRemount": false,
  "_debugHookTypes": null
}

```

`React Fiber` 에는 다음과 같은 메타 정보들이 포함되며 간략한 설명은 다음과 같다.

- `tag` : React가 해당 Fiber가 어떤 종류의 컴포넌트인지 인식하는 숫자 값,
  예를 들어 5는 HostComponent( HTML 태그와 같은 실제 DOM 요소), 0은 함수 컴포넌트, 1은 클래스 컴포넌트 등을 나타낸다.
- `elementType` : 해당 Fiber가 생성된 원본 React Element의 type 속성과 동일.
  main 태그, div 태그, 혹은 특정 React 컴포넌트 함수/클래스 자체가 될 수 있다.
- `type` : HostComponent의 경우 실제 HTML 태그의 이름(예: "div", "span", "main")을 나타낸다.
  함수 컴포넌트나 클래스 컴포넌트의 경우 해당 컴포넌트 함수의 참조나 클래스 자체를 가리킨다.
- `stateNode` : 이 Fiber에 연결된 실제 인스턴스를 저장한다. HostComponent(HTML 태그)의 경우 실제 DOM 노드의 객체를 가리킨다.
  1. `return` 은 현재 Fiber의 부모 Fiber를 가리킨다. 
  2. `child` 는 현재 Fiber의 첫 번째 자식 Fiber를 가리킨다.
  3. `sibling` 은 현재 Fiber의 다음 형제 Fiber를 가리킨다.
- `flags` : 해당 Fiber가 실제 DOM에 적용되어야 할 부수 효과(노드 추가, 업데이트, 삭제)의 종류를 나타내는 비트 플래그.
- `memoizedProps` : 해당 Fiber가 이전에 성공적으로 렌더링되었을 때 사용된 props 객체를 저장한다. 
다음 렌더링 주기에서 새로운 `pendingProps`와 해당 값을 비교하여 props의 변경 여부를 판단하고, 필요한 경우에만 리렌더링을 진행한다. 
- `memoizedState` : 해당 Fiber가 렌더링된 후의 최종 상태(state)를 저장한다. 컴포넌트의 최신 상태 값이 여기에 저장된다.
- `updateQueue` : 해당 Fiber에 대기 중인 업데이트 요청들의 큐이다.
컴포넌트의 상태를 변경하는 모든 요청이 여기에 저장되고, React는 이 큐를 처리하여 다음 렌더링 주기에서 상태를 업데이트 한다.
- `lanes` : 특정 Fiber에 대기 중인 업데이트의 우선순위를 나타내는 비트 플래그. React는 이 lanes 정보를 사용하여 어떤 업데이트가 더 긴급하고 먼저 처리되어야 하는지 판단하고, 렌더링 작업을 중단/재개하는 등의 스케줄링을 수행한다.
예를 들어, 사용자 입력 이벤트로 인한 업데이트는 높은 우선순위의 lane을 가진다.
- `childLanes` : 해당 Fiber의 자식 트리에 존재하는 모든 Fiber들에 대기 중인 업데이트의 lanes를 집계한 값. 
이 값을 통해 React는 부모 Fiber 뿐만 아니라 필요한 경우에만 해당 하위 트리를 탐색하여 작업을 진행한다.


### 더블 버퍼링 

재조정자는 이렇게 생성된 `React Fiber Tree` 를 내부적으로 `더블 버퍼링` 이라는 개념을 통해 렌더링을 효과적으로 관리한다.

더블 버퍼링이라는 개념은 화면에 끊김 없는(seamless) 연속적인 상태를 보여주기 위해 내부적으로 두 개의 버퍼를 사용하는 방법을 말한다.

한 버퍼는 현재 사용자에게 보이는 내용을 담고 있고, 다른 버퍼는 다음 화면을 그리기 위한 작업을 진행한다.

모든 작업이 완료되면 두 버퍼를 즉시 교체하여 화면을 업데이트함으로써, 사용자에게는 작업 중인 모습을 보여주지 않고 부드러운 전환을 제공하여 중단 현상을 줄인다.

UI 변화가 감지되면 재조정자는 현재 화면에 렌더링된 Fiber 트리(Current Tree)를 복제하여 새로운 작업용 트리(Work-in-progress Tree)를 생성한다.

이 Work-in-progress Tree는 다음 렌더링될 화면을 준비하기 위한 임시 버퍼 역할을 한다.

재조정자는 Work-in-progress Tree의 Root 노드부터 시작해 위에서 아래로 Fiber 트리를 순회하며 각 노드에 대한 업데이트 작업을 진행하는데,
이 과정에서 업데이트가 필요한 부분은 해당 Fiber 노드의 flags(effectTag)에 마킹한다.

각 Fiber Node에 대한 작업이 완료되면, 재조정자는 Work-in-progress Tree를 다시 자식 노드에서 부모 노드 방향(아래에서 위)으로 순회하면서 각 노드의 flags에 마킹된 정보들을 상위 노드로 통합해,
실제 DOM에 반영할 효과(노드 추가, 업데이트, 삭제 등) 리스트를 구성한다.

모든 Fiber에 대한 작업이 완료되고 Work-in-progress Tree의 flags를 통해 변경 사항이 확정되면,
재조정자는 이를 바탕으로 실제 DOM을 업데이트하고 화면에 반영한다.

이 과정에서 Current Tree는 작업을 마친 Work-in-progress Tree로 대체된다.

이 모든 과정은 화면상에 보이지 않는 뒤편에서 일어나며, 이로써 다음과 같은 이점을 얻을 수 있다.

- 사용자가 보고있는 화면에 영향을 주지 않고 작업을 진행할 수 있다.
- 화면의 뒤편에서 일어나기 때문에, 언제든지 작업내용을 버리거나 중지한 후 다시 시작할 수 있다.


## Render 와 Commit 

위에서 대략적인 더블 버퍼링의 개념과 React 렌더링의 과정에 대해서 파악한 것을 바탕으로 
이번엔 좀 더 세부적인 과정에 대해서 살펴보자.

위에서 언급한 과정은 다시 이렇게 분류할 수 있다.

1. `Render Phase` : Work-in-progress Tree를 생성하고, React Element와 Current Tree를 비교하여 UI의 변경 사항을 계산하고 Work-in-progress Tree에 반영하는 단계
2. `Commit Phase` : Work-in-progress Tree에 기록된 변경 사항들을 실제 DOM에 적용하고, Work-in-progress Tree를 Current Tree로 교체하는 단계

`Render Phase`에서는 우리가 통상적으로 생각하는 '렌더링'의 작업, 즉 컴포넌트를 호출하고 상태(state)와 props를 기반으로 다음 UI를 계산하며 변경 사항을 Work-in-progress Tree에 마킹하는 일들이 이루어진다.

`Commit Phase`에서는 Render Phase에서 준비된 변경 사항들을 바탕으로 실제 DOM을 조작하여 화면에 업데이트된 UI를 반영하는 작업들이 이루어진다.


### Render Phase (Reconciliation Phase)

`Render Phase`는 Work-in-progress Tree를 순회하면서, Current Tree의 각 Fiber와 새로 생성된 React Element를 비교하여 필요한 업데이트를 계산하고, 해당 Fiber에 flags(effectTag)를 마킹하는 작업을 진행한다.

UI 업데이트 이벤트가 확인되면, 재조정자는 Root Fiber Node에서부터 `beginWork` 함수를 호출하며 렌더링 작업이 시작된다.

1. `beginWork`

`beginWork` 함수는 current tree 와 work-in-progress tree 상의 해당 노드에 대한 참조를 전달받아 비교를 통해 해당 Fiber의 type, props, state 등이 변경되었는지 확인하고,
업데이트가 필요하다고 판단될 경우 해당 Fiber의 flags에 적절한 effectTag를 마킹한다.

각 `beginWork` 호출은 현재 노드의 자식 노드에 대한 작업을 시작하거나, 자식이 없다면 다음 형제 노드로 이동하여 `beginWork`를 계속 호출하는 방식으로 트리를 깊이 우선으로 탐색한다.

이 작업은 모든 트리의 노드를 순회할 때까지 진행된다.

2. `completeWork`

`beginWork` 작업이 완료되고 순회가 끝이나면 해당 노드에서부터 `completeWork` 함수가 호출된다. 
`completeWork`는 자식 노드에서 부모 노드 방향(즉, 트리를 거꾸로 Root 노드에 다다를 때까지)으로 진행한다.

`completeWork` 함수는 해당 Fiber의 flags에 마킹된 effectTag를 확인하고,
실제 DOM 조작(DOM 노드 생성, 업데이트, 삭제)에 필요한 side effect를 상위 Fiber로 전달하여 effect list를 구축하는 역할을 한다.
또한, 호스트 컴포넌트의 경우 실제 DOM 노드를 생성하거나 속성을 업데이트하는 초기 작업을 수행하기도 한다.

Root 노드에 다다라 Render Phase가 완료되면, 
Work-in-progress Tree는 실제 DOM에 반영할 모든 변경 사항(flags와 effect list)을 포함한 상태가 되고 이제 실제 변경을 적용할 단계로 진입한다.

### Commit Phase

`Commit Phase`는 Work-in-progress Tree에 기록된 모든 변경 사항과 부수 효과(flags)를
실제 DOM에 적용하고 화면을 업데이트하는 작업을 실행한다.

`Commit Phase` 에서는 다음과 같은 작업들이 순서대로 진행된다.

1. `Mutation Phase`

Commit Phase에서 가장 먼저 진행되는 단계로, Render Phase에서 각 Fiber에 마킹된 Placement, Update, Deletion 등의 effectTag를 확인하여
실제 DOM에 필요한 모든 변경(DOM 노드 추가, 속성 업데이트, 텍스트 변경, 노드 삭제 등)을 직접 적용한다.

2. `Layout Phase`

Mutation Phase가 완료되어 모든 DOM 노드 조작이 끝난 직후 브라우저가 화면에 실제로 변경사항을 그리기(Paint) 전에 `useLayoutEffect` 훅들이 실행되며 레이아웃 작업을 진행한다. 
이 단계에서는 새롭게 업데이트된 DOM 노드의 크기나 위치와 같은 정보를 계산하거나 조작할 수 있도록, 레이아웃 정보가 업데이트 된다.

3. `Passive Effect Phase`

Mutation Phase와 Layout Phase가 모두 완료되면 브라우저가 DOM 변경사항을 화면에 실제로 페인팅 한 이후,
브라우저의 유휴시간에 `useEffect` 들을 통해 작성된 부수효과들이 실행되도록 스케쥴링 한다. 

위의 모든 Commit Phase 작업들이 완료되면, React는 현재 Work-in-progress Tree를 Current Tree로 설정한다. 
이때 이전의 Current Tree는 다음 업데이트 시 재사용될 수 있도록 alternate 참조를 통해 보관되거나 버려진다.



---
## 마치며

JSX, React Element, React Fiber 등을 통해서 리액트 렌더링의 내부적인 과정을 대략적으로 살펴보았다.

렌더링 과정에 대해 이해한 바를 바탕으로 다음으로 React 의 동시성 렌더링 과정을 이해할 준비를 해보도록 하자. 

<br/>

_reference: [ 전문가를 위한 리액트](https://product.kyobobook.co.kr/detail/S000214977649)_


<br/>
<br/>
