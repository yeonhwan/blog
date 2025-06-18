---
title: Lexical으로 에디터 구현해보기
excerpt: "Lexical 알아보기"
date: 2023-05-30T04:06:22.173Z
publish: true
slug: lexical으로-에디터-구현해보기
tags: [Lexical, UI, Library]
---

## 들어가며

프로젝트를 만들어가면서, 간단한 하루 일기를 작성하고 저장할 수 있는 UI 가 있으면 좋겠다는 생각이 들었다.

기왕이면 `<textarea>` 나 `<input>` 을 통해서 단순한 스트링을 받는 것보다는, 기분을 기록하거나 에디터 등의 여러가지 기능을 사용할 수 있다면 더 좋지 않을까라는
생각이 들어 한 번 만들어보기로 했다.

구현해보고자 하는 것은 **사용자의 기분을 기록하고, 그날 있었던 기능을 간단하게 에디터를 통해 기록할 수 있는 UI** 였다.

### 생각해보기

우선, UI 를 두 부분으로 나누어서 구성하기로 결정했다.

1. 사용자의 그날 기분을 좋음 - 나쁨 사이의 5가지 중에 하나로 선택
2. 에디터를 통해서, 간단한 마크다운을 통해 기록할 수 있게 구성

1 번의 경우, Lottie 를 사용한 셀렉터로 간단하고 귀엽게 만들었는데, 에디터의 경우 고민해야할 부분이 꽤 많았다.

너무 많은 기능을 담은 에디터를 그대로 들여올 경우, 데이터 관리 및 전송에 생각해봐야 할 부분이 너무 많아지며,
보통 이러한 라이브러리들은 완성된 형태로 제공되기 때문에 기능을 커스터마이징 하거나 스타일을 손보거나 하는 부분이 꽤 간단하지 않기 때문이었다.

`WYSIWYG(What You See Is What You Get` 에디터라고 보통 부르는 이 에디터들은 이미 커뮤니티에서 사용되는 `Toast UI editor`, `Quill`, `Draft` 등의 몇몇 선택지들이 있었다.
하지만 라이브러리 업데이트가 끊겨 있거나, 내가 조금 손봐서 사용하기에는 너무 무겁거나 하는 문제를 가지고 있었다.

그러던 중 `Lexical` 이라는 라이브러리를 발견하게 되었고, 이를 통해서 구현할 수 있겠다는 생각이 들었다.

## Lexical

다른 라이브러리들이 사용성을 목표로 완성된 기능과 UI 를 갖춘 컴포넌트 자체를 배포하고 있다면
`Lexical` 라이브러리는 다른 에디터 라이브러리와는 전혀 다른 접근법을 가지고 있다.

`Lexical` 은 텍스트 에디터를 구현하기 위한 기능들의 빌딩 블록 들을 모듈로써 제공하는 라이브러리이다.
Headless UI 처럼 기본 바탕만을 취사선택해 사용하되, 필요한 부분들은 직접 스타일링하고 조합해 사용하는 방식인 것이다.

이러한 방식을 통해 얻을 수 있는 장점은 여러가지가 있었다.

1. 디펜던시가 없고, 가볍게 필요한 기능만을 뽑아서 구성할 수 있다.
2. 사이즈가 굉장히 작다. 코어 모듈만을 포함하면 22kb 정도로 구성할 수 있다.
3. 기능만을 제공하기 때문에, 필요한 부분은 직접 작성 및 수정하면서 개발할 수 있다.

뿐만 아니라 Facebook 팀에서 제작 및 오픈소스로 관리하는 패키지였기 때문에 React 에 대한 지원이 잘 구성되어있으며
활발히 업데이트가 되고 있었다.

지금까지 말한 장점들은 모두 양날의 검인 부분도 있다. 왜냐하면 스스로 모두 필요한 부분들을 전부 구성해야한다는 말과 다르지 않기 때문이다.
그래도 필요한 요구사항에 딱 들어맞는 라이브러리였기 때문에 직접 구현하면서 알아본 사실들을 통해 라이브러리에 대해 알아보도록 하자.

### Core

**editorState**

`Lexical` 의 제일 핵심적인 부분은 에디터의 현재 상태를 트리구조로 구현하고 있는 `editorState` 객체이다.
`editorState` 는 `Lexical` API 를 통해서 입력되는 인풋 값을 구조화하고 전달할 수 있는 상태를 만든다.

`editorState` 의 값은 단순히 텍스트 값을 뿐만 아니라, children, direction, format, indent 등의 에디팅에 필요한 많은 값들을 같이 저장하고
활용할 수 있도록 구성되어 있다.

`editorState` 자체는 직렬화 할 수 있는 값들로 이루어져 있어 HTTP 를 통해서 전달될 수 있어, 다른 특별한 데이터 변환 단계를 거치지 않고 그대로 저장 및 출력할 수 있다.

`Hello World!` 라는 텍스트를 가진 `editorState` 의 예시 값은 이렇게 구성된다.

```json
{
  "root": {
    "__type": "root",
    "__format": "",
    "__indent": 0,
    "__children": [
      {
        "__type": "paragraph",
        "__format": "",
        "__indent": 0,
        "__children": [
          {
            "__type": "text",
            "__text": "Hello World!",
            "__format": 0,
            "__mode": "normal",
            "__detail": 0
          }
        ],
        "__dir": "ltr"
      }
    ],
    "__dir": "ltr"
  }
}
```

**Node**

Node 는 `editorState` 에서 하나의 콘텐츠 단위들이 트리의 노드를 이루고 있는 부분을 말한다.
`editorState` 의 값을 다루는 기본단위가 되는 것이 이 Node 이다.

Node 종류에는 `editorState` 의 가장 핵심이 되는 `root` 노드, 플레인 텍스트를 나타내는 `TextNode`,
단락을 나타내는 `ParagraphNode` 등 다양한 콘텐츠 형식을 포함해 구성된다.

이 Node 를 기반으로 다음에 설명한 플러그인 들이 필요에 따라 사용될 수 있다.

**Plugin**
앞서 말했듯이 `Lexcial` 은 각각의 기능이 플러그인 형태로 모듈로 구성되었는 패키지이다.
필요한 기능 있다면 해당 기능을 따로 인스톨 하거나 직접 작성하여 `Lexical` 에 연동해서 사용할 수 있다.

기본 마크다운 기능을 포함해 특정 이벤트나 특정 기능을 구현할 수 있도록 하는 패키지들이 제공되고 있다.
기본적으로 제공되는 플러그인 리스트들은 다음과 같으며, 해당 링크에서 찾아볼 수 있다.

[Lexical 플러그인 리스트](https://lexical.dev/docs/packages/lexical)

<br/>

### 사용할 준비하기

`Lexcial` 을 통해 구현하고자 했던 기능들은 다음과 같다.

1. 간단한 마크다운을 툴바형식으로 지원할 수 있도록 하자.
2. 사용자의 입력을 인식해서, 자동저장 기능을 제공하자.

그러나 그전에 가장 먼저 구성해야할 부분은,
`Lexical` 를 사용할 수 있는 환경을 만드는 것이다.

React 코드베이스에서는 이 부분을 `<LexicalComposer/>` 를 통해서 구현한다.
이름 그대로 `Lexical` 을 환경의 바탕을 구성해주는 컴포넌트인데, 초기 설정 단계에서 에디터의 테마, 네임스페이스,
에러 처리, 필요한 노드 리스트(플러그인) 등을 작성해줄 수 있다.

또 `<LexicalComposer/>` 는 하나의 Context Provider 로써, `useLexicalComposerContext` 훅을 통해서
자식 컴포넌트들에서 `editorState` 에 접근할 수 있도록 만들어준다.

`@lexical/react` 패키지를 통해서 사용이 가능하며 간단하게 구성하면 이렇게 된다.

```typescript

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const Editor = () => {

  const config = {
      theme: "테마 값",
      namespace: "에디터 구분자",
      onError: "에러 핸들러",
      nodes: ["플러그인 리스트..."],
  }

  return (
  <LexicalComposer initialConfig={config}>
    <EditorView/>
  </LexicalComposer>
  )
}

const EditorView = () => {
  const [editor] = useLexicalComposerContext();

  return (
  <div>
    <ContentEditable/>
    {... 필요한 컴포넌트 혹은 플러그인}
  </div>
  )
}
```

간단한 시스템은 이렇게 된다.

1. `<ContentEditable/>` 컴포넌트를 통해 인풋을 전달받을 수 있는 부분을 구성한다.
2. `useLexicalComposerContext` 훅을 통해서 하위 컴포넌트들에서 `editor` 객체를 얻어, 다양한 작업들을 처리할 수 있다.
   `editor` 객체는 `editorState` 자체에도 접근할 수 있으며 다양한 API 를 제공한다.

실제 에디터로 기능할 부분들은 `<LexicalComposer>` 의 자식컴포넌트로 구성해 위치시켜야한다.
실제 플러그인들을 위치시키는 부분도 이 곳에 해당한다.
`editor` 객체를 통해 Node 를 조정하고 변환하는 과정을 거치기 때문이다.

이렇게 구성하면 이제 작업을 시작할 수 있는 아주 기본적인 바탕이 마련된 것이다. 그러나 기능은 아무것도 붙어있지 않다.

이제 기능과 UI 를 직접 구현하는 부분은 전적으로 사용자에게 달려있다.

그러면 툴바 구현을 한다고 상정하고 어떻게 하면 실제 기능을 구현할 수 있을지 좀 더 알아보자.

### 기능 구현하기

가장 먼저 툴바를 구현한다고 생각한다면 인풋을 입력하고, 필요한 마크다운 문법 기능을 제공하는 것을 생각해볼 수 있다.

`RichTextPlugin` 패키지와 몇몇 추가적인 패키지를 통해서 기본바탕을 구현할 수 있다.

이 플러그인은 `ContentEditable` 을 자식요소로 받아 간단한 마크다운을 지원하도록 확장하는 것 뿐만 아니라
placeholder, 복사-붙여넣기, 텍스트 입력 및 삭제 등의 기능을 할 수 있도록 제공한다.

사실상 해당 플러그인 혹은 `PlainTextPlugin` 을 통해서 시작점을 마련해야 한다고 볼 수 있다.

`editor` 가 추가적인 Node 들을 지원해주어야 하니, 다음과 같이 한 후 해당 기능을 지원할 수 있도록 `config` 객체를 추가로 수정한다.

```typescript {3,5-6,15,30}
...
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";

const Editor = () => {

  const config = {
      theme: "테마 값",
      namespace: "에디터 구분자",
      onError: "에러 핸들러",
      nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
  }

  return (
  <LexicalComposer initialConfig={config}>
    <EditorView/>
  </LexicalComposer>
  )
}

const EditorView = () => {
  const [editor] = useLexicalComposerContext();

  return (
  <div>
    <RichTextPlugin contentEditable={<ContentEditable />}/>
  </div>
  )
}
...
```

그럼 이제 기능 구현을 진짜로 시작할 준비를 마쳤으니,
관련된 `Lexical` 시스템을 조금 더 알아보도록 하자.

<br/>

**State Cycle**

이전에 `Lexical` 의 핵심적인 부분은 `editorState` 이라고 말한 적이 있다.
이 `editorState` 의 값을 읽고 직접 업데이트 하면서, 에디터의 각 기능들을 구현해나갈 수 있다.

`editorState` 는 두 가지의 메소드를 제공하면서 하나의 cycle 을 이루어 나간다.

1. `editorState.read`: 현재 `editorState` 값을 읽어 들이는 과정을 실행한다.
2. `editor.update` : 다음 `editorState` 값을 안정적으로 업데이트 할 수 있는 유일한 과정이다.

각각의 두 함수는 하나의 콜백 함수를 전달할 수 있다.
해당 콜백 함수를 통해서 각 작업을 통합하고 필요한 스코프를 만들어내는 역할을 하는 것이다.

`editorState.read` 는 React state 처럼 상태를 초기화하고 세팅하는 과정을 실행하는 부분을 말한다.
이 과정에서는 `editorState` 에 관한 정보를 읽고 이를 기반으로 원하는 값을 만들어낼 수 있다.

`editor.update` 는 setState 처럼 다음 `editorState` 를 업데이트 하기 전에 실질적으로 `editorState`
값을 조작하거나 다음 `editorState` 를 생성하기 전에 부수효과들을 실행시키기 위해서 사용한다고 볼 수 있다.

`read` 과정은 `editorState` 접근할 수 있는 다양한 API 들을 통해서 언제든지 실행 가능하지만,
`update` 과정은 직접적으로 `editor.update` 메소드를 통해서만 이루어질 수 있다.

<br/>

**Selection**

`Lexical` 에는 `selection` 이라는 개념이 추가적으로 사용된다.

사용자가 `Lexical` 과 상호작용하면 드래그, 클릭 등을 통해서 `editorState`
내에 특정 부분을 선택하면 이 메타정보를 담아 저장 하는데, 이 정보를 읽고 사용할 수 있도록 하는 부분이 `selection` 라고 할 수 있다.

이 `selection` 에는 `NodeSelection`, `RangeSelection` 등 몇 가지 종류의 셀렉션을 기본적으로 제공한다.

툴바 기능을 구현하기 위해서는 드래그 와 같은 범위 선택이 필요하기 때문에 `RangeSelection` 을 사용했다.

코어 API 인 `getSelection` 과 `isRangeSelection` 함수를 사용하면 현재 에디터에서 선택된 범위를 구해낼 수 있다.
selection 을 얻고 나면 몇 가지 메소드와 프로퍼티에 접근할 수 있는데 포맷(format) 관련 정보 또한 얻을 수 있다.

그렇다면 다음과 같은 함수를 작성해 해당 셀렉션이 어떤 포맷을 가지고 있는지 그 기반에 따라 상태를 설정할 수 있게 된다.

```typescript {3,4,5,18-21}
//...
const updateToolbar = useCallback(() => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const hasBold = selection.hasFormat("bold");
    const hasItalic = selection.hasFormat("italic");
    //...
    setIsBold(hasBold);
    setIsItalic(hasItalic);
    //...
  }
}, []);
//...

useEffect(() => {
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });
}, [editor, updateToolbar]);
```

그리고 이렇게 작성된 셀렉션 탐지 기능을 싸이클에 다음과 같이 붙이게 되면,
선택된 부분이 어떤 포맷을 가지고 있는지 파악할 수 있게 된다.

**Command**

그러면 이제 기반이 되는 상태를 파악했으니 실제로 변경을 일으키는 과정이 필요하다.
이 부분은 직접 내부 API를 사용해 직접 작성할 수도, 이미 만들어진 `Command` 를 통해 사용할 수도 있다.

`Command` 란 이벤트 시스템 기반으로 `register`, `dispatch` 를 통해 `Lexcial` 의 시스템에서 특정
이벤트를 등록하거나 이벤트를 기반으로 효과를 일으키거나 하는 과정을 말한다.

간단한 `fomrat` 값의 변경이나 텍스트를 변경하는 등의 과정은 직접 구현해도 좋지만, 이미 구현되어있는
`Command` 를 통해서 안정적으로 기능을 구현하는 것도 괜찮다.

```typescript {5, 8}
//...
const buttonHandler = (value: string) => {
  switch (value) {
    case "bold":
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      break;
    case "italic":
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      break;
    // ...
    default:
      break;
  }
};
```

**Theme**

`Lexical` 이 어떠한 UI 나 스타일을 제공하지 않는다는 것을 기억할 것이다.
이 말은 에디터로 작성된 어떠한 콘텐츠라도 의미있도록 표현하려면 직접 스타일을 작성해야한다는 말과 같다.

그래도 다행인 사실은 `theme` 라는 것을 통해서 보다 조금 편하게 스타일을 작성할 수 있는 기능을 제공한다.
이전에 `LexicalComposer` 를 작성할때 주입했던 `theme` 이 바로 그것이다.

```typescript
const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
};
```

다음과 같이 작성해서 `config` 부분에 집어넣어주면,
해당 요소에 대해 `Lexical` 이 클래스네임을 주입해 준다.
사용자는 이 클래스네임을 기준으로 스타일을 작성하면 된다.

자세한 내용은 [해당 부분](https://lexical.dev/docs/getting-started/theming) 을 참고하도록 하자

<br/>

## 마치며

사실 제대로 설명한 건지는 잘 모르겠지만, 내가 `Lexical` 을 사용하면서 필요하다고 느꼈던 핵심 개념들을 적었다.
이정도의 내용도 가장 작은 부분에 속하고 아직 직접 구현하거나 경험해보지 못한 부분이 훨씬 더 많다.

시스템을 한 번 이해하고 나면 그 다음 다양하게 활용해서 사용할 수 있는 방법이 너무 많기 때문에,
에디터를 직접 구현해보고 싶거나 가볍게 사용해야할 에디터가 필요하다면 좋은 방법이라고 생각한다.

공식문서가 자세하지는 않지만 잘 쓰여져 있고 예제를 찾아보다 보면 에디터를 만들어 보는 것도 어렵지 않을지도 모르겠다.
그리고 더 이상 에디터에 대한 고민을 안해도 될 수 있을지도 모르고.

~더 자세하게 예제를 통해서 사용하면 좋겠지만 끝도 없이 길어질 것 같은 느낌이 들기 때문에 이만 소개글 정도로 마친다...~
