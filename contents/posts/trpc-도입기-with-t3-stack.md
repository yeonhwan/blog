---
title: tRPC 도입기 (with T3 stack)
excerpt: "tRPC를 통한 E2E 환경 구성"
date: 2023-06-17T04:05:22.790Z
publish: true
slug: trpc-도입기-with-t3-stack
tags: [tRPC, T3, Library]
---

## 들어가며

`Next` 를 사용해서 풀스택 프로젝트를 만들어보자고 결정하고 나니 여러가지 문제가 머릿속에 떠올랐는데,
그 중에서도 가장 문제였던 부분은 서버와 클라이언트를 어떻게 한 코드베이스 안에서 잘 구현하느 냐 하는 부분이었다.

`Next` 가 서버 코드를 api 라우팅을 통해 작성하면 알아서 해결해 준다는 것은 알고 있었지만,
그냥 이렇게 덜렁 함수만 작성하면 끝나는 일인지 잘 감이 잡히지가 않았다.

express 와 mongoDB를 통해서 서버를 구성해본 경험이 있었기에 API 작성 자체가 큰 문제는 아니었다.

한 레포지토리내에서 타입은 어떻게 기준을 잡고 관리할 것인지, 클라이언트 함수들을 어떻게 잘 관리하고 구성할 것인지
등의 관리문제에 대한 고민에 빠졌던 것이다.

그렇게 프로젝트 레퍼런스로 참을 만한 자료들을 검색 하다가, 한 유튜브를 보게 되었고
거기서 `tRPC` 라는 라이브러리를 발견하게 되었다.

그런데 이런 고민을 간단하게 해결해주는 것처럼 보이는 게 아닌가?
심지어 방법도 크게 어렵지 않아 보였다. ~까놓고 보니 실제로 마냥 그랬던 건 아니었다~

그래서 `tRPC` 와 이를 나에게 소개시켜준 `T3 stack` 에 대해 말해보고자 한다.

## tRPC

먼저 `tRPC` 라는 말 자체가 조금 생소할 수 있기 때문에 이에 대해 먼저 이해하고 넘어가는 게 먼저 일 듯 하다.

공식 문서를 살펴보면 `RPC` 에 대해서 이렇게 설명하고 있다.

> RPC is short for "Remote Procedure Call". It is a way of calling functions on one computer (the server) from another computer (the client). With traditional HTTP/REST APIs, you call a URL and get a response. With RPC, you call a function and get a response.

> \- RPC 는 "원격 프로시저 호출" 의 줄임말입니다. 이는 한 컴퓨터(서버)에 존재하는 함수들을 다른 쪽에 있는 컴퓨터(클라이언트)가 실행시키는 한 방법을 말합니다. 전통적인 HTTP/REST API 들을 사용해서 URL 을 호출하고 응답을 받았다면, **RPC 를 통해서는 대신 함수를 호출하고 응답을 받습니다**.

<br/>

다시 말하면 브라우저 클라이언트 코드에서 `fetch`, `axios` 의 함수들에 서버 URL 주소를 인자로 HTTP 응답을 결과로 받던 기존의 방식이 대신,
클라이언트에서 서버의 함수를 직접적으로 호출해 같은 응답을 받아오는 것이다.

실제로는 그저 함수를 달랑 실행시키는 것이 아니라, HTTP 연결 및 쿼리 함수 생성등의 단계를 사용하기 편하도록 추상화시켜주는 것에 가깝지만,
이에 대한 것은 이후 코드를 통해 살펴보도록 하자.

근데 `RPC` 앞의 `t` 는 무엇을 말하는 것일까?
소개란에 크게 써져 있는 것처럼 이는 `typesafe` 라는 말을 의미한다.

이 둘 을 붙여보면 `typesafe Remote Procedure Call` 이 되는데, 이러면 이제 라이브러리의 소개 문구와 용도가 이해되기 시작한다.

![trpc](/contents/trpc-도입기/1.webp)

<br/>

> End-to-end typesafe APIs made easy

> \- 쉬운 엔드투엔드 typesafe 한 APIs

### 살펴보기

클라이언트와 백엔드 간의 연동을 쉽게 만들어주고, 타입 관리를 편하게 만들어 준다니!
딱 필요한 기능을 제공하는 라이브러리가 아닐 수 가 없었다.

그러면 어떤 일이 일어나는 건지 어떤 이점을 직접적으로 얻게 되는 건지 간단하게 환경을 구성해보면서 파악해보자.

<br/>

**1. tRPC 구조 확인하기**

먼저 `tRPC` 는 `@trpc/server`, `@trpc/client` 의 두 패키지로 나뉘어져 있다.
각각의 추상화 계층과 역할이 다르기 때문에 각각의 패키지를 취사선택해 사용할 수 있기 때문이다.

본격적으로 코드를 다루기 전에간단한 구조를 그림으로 보고 가면 좋을 것 같다.

![trpc-diagram](/contents/trpc-도입기/2.webp)

각각의 패키지는 서버, 클라이언트에 한 겹의 레이어를 씌운다.
우리가 직접적으로 데이터 레이어를 다루는 대신 이를 `tRPC` 패키지에 위임해 편의성을 도모하는 것이다.

먼저, `@trpc/server` 패키지는 RPC 과정에 바탕이 되는 `tRPC` 객체를 생성한다음,
이 생성된 `tRPC` 객체를 통해 `router`, `procedure` 를 생성한다.

REST API 에 비유하자면, `router` 의 경우 말 그대로 API 가 리소스가 가리키는 라우트
`procedure` 의 경우 해당 라우트에 할당된 각각의 API 핸들러라고 보면 좋다.

이렇게 서버라우팅을 구성하는 과정에서, API 핸들러 함수 본문외의 부분(라우팅, 메소드 등)을 작성하지 않는데,
이는 자동적으로 `tRPC` 에 의해 정해지고 관리되기 때문이다.

`tRPC` 객체에는 작성한 API 와 `Procedure` 에 대한 정보가
API 핸들러의 input / output 을 기반으로 구성되어 RPC 소통의 근간이 되는 역할을 한다.

이제 `@trpc/client` 패키지는 이제
`ProxyClient` 레이어를 생성해 클라이언트에서 필요로 하는 API 호출 함수와 연결을 import 된 `Router` 객체를 기반으로 자동으로 생성해준다.

`tRPC` 의 장점은 여기서 나오는데, 이 과정에서 이루어지는 **모든 HTTP 연결, 타입 관리, API 쿼리/뮤테이션 함수 등을 전부 자동으로 만들어 주기** 때문이다.
이름에서부터 강조하다시피 `typesafe` 한 방식으로 말이다.

심지어 React 로 클라이언트가 작성되어있다면, 편리하게 사용할 수 있게 **`@trpc/react-query`를 통해 `React Query` 로 자동으로 래핑하여 구성**해주는 패키지도 제공한다.

2. **tRPC 셋업하기**

이제 그러면 코드를 통해서 간략하게 살펴보도록 하자.
환경은 `Next` 프로젝트를 통해 서버 / 클라이언트를 구성한다는 전제로
독스의 예시 코드를 참조했다.

먼저 독스에서 권장되는 폴더 스트럭쳐를 구성한다.

```bash
.
├── prisma  # <-- if prisma is added
│   └── [..]
├── src
│   ├── pages
│   │   ├── _app.tsx  # <-- add `withTRPC()`-HOC here
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc].ts  # <-- tRPC HTTP handler
│   │   └── [..]
│   ├── server
│   │   ├── routers
│   │   │   ├── _app.ts  # <-- main app router
│   │   │   ├── post.ts  # <-- sub routers
│   │   │   └── [..]
│   │   ├── context.ts   # <-- create app context
│   │   └── trpc.ts      # <-- procedure helpers
│   └── utils
│       └── trpc.ts  # <-- your typesafe tRPC hooks
└── [..]

```

조금의 설명을 붙여보자면

- `_app.tsx`: 여기가 클라이언트의 엔트리포인트이자, `proxyClient` 가 덧씌워지는 부분이다.
- `api/trpc/[trpc].ts` : 이 곳은 서버의 API 라우팅이 이루어지는 파일이다. 로직 부분은 `server/` 디렉토리에 존재한다. 다시 말하면, `api/trpc/...` 로 호출되는 연결을 모두 `tRPC` 라우터에게 위임한다고 보면 된다.
- `server/...` : 이곳이 핵심적인 `tRPC` 로직들이 존재하는 디렉토리이다. 이곳에 API 핸들러등 서버 로직을 작성하게 된다.
- `context.ts` : Request, Response 객체 외에 서버 콘텍스트를 주입하고 싶다면 여기 작성하도록 한다

**Server**

먼저 서버의 `tRPC` 라우터를 구성해보도록 하자.
다음과 같은 과정을 거쳐 `tRPC router` 를 생성하고 `api` 라우터에 연결한다.

```typescript title="server/trpc.ts"
import { initTRPC } from "@trpc/server";

// tRPC object
const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;
```

`tRPC Object` 객체를 생성한뒤, 이를 통해 `router` 와 `procedure` 를 생성하는 과정이다.

이렇게 가장 기본적인 준비가 됐다면, 이를 통해 실제 API 핸들링 로직 코드를 작성할 수 있다.

```typescript title="server/routers/_app.ts"  {5-9} {11-14} {19}
import { z } from "zod";
import { procedure, router } from "../trpc";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
```

코드를 살펴보면, 몇 가지 디테일한 구성 요소를 볼 수 있다.

1. `procedure`를 `router` 에 등록할 때는, key-value 형태로 등록하며 이 key 가 `procedure` 의 명칭이 된다.
2. `procedure` 는 몇 가지 메소드들을 제공하고 이를 체이닝 함으로 API 핸들링을 처리한다.
3. 해당 `router` 의 타입을 `export` 함으로써, 타입을 공유할 준비를 한다.

이 방식의 `tRPC` 서버 라우터를 구성하는 기본 단계이다.

이제 생성된 `tRPC` 라우터를 서버에 붙이면 동작할 준비가 끝나는데, 각각의 서버 환경에 따라 구현이 달라진다.
`Next` 의 경우 어댑터를 통해서 이를 구현하고 있으며, 어댑터는 모든 라우트 전역에서 설정할 수 있는 추가 기능들을 제공 한다.

```typescript title="pages/api/trpc/[trpc].ts"
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";

// export API handler
// @see https://trpc.io/docs/server/adapters
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
```

이 `tRPC` API 핸들러가 내부적으로 `/api/[trpc]` 로 들어오는 요청을 분기처리 하여 매핑 시켜주는 역할을 하는 것이다.

<br/>

**Client**

그림에서 살펴본 바와 같이 클라이언트의 요청을 전달해줄 `ProxyClient` 환경,
그리고 `tRPC` 객체와 클라이언트 레이어를 연결시켜주면 끝난다.

```typescript title="utils/trpc.ts" {2-3} {11} {14-25}
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";

function getBaseUrl() {
  // 서버가 위치할 base URL 을 구성하는 로직..
  // 공식문서에 레퍼런스가 잘 나와있다.
  return `http://localhost${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});
```

1. 서버의 `Router` 객체를 받아 클라이언트 타입환경을 구성한다. 서버 클라이언트간 타입 안정성은 여기서 나온다.
2. `httpBatchLink` 메소드를 통해 서버 URL 을 확정한다. 이때, 헤더를 설정하는 등의 작업을 처리할 수 있다.
3. 마지막으로 생성된 `tRPC` 클라이언트를 반환한다. 이 클라이언트가 모든 RPC API 함수들을 포함한 객체이다.

이제 `tRPC` 클라이언트가 준비 됐다면, 클라이언트 APP 에 연결하면 사용할 준비가 끝난다.

```typescript title="pages/_app.tsx"
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
```

`withTRPC` 함수는 APP 컴포넌트를 받아, `tRPC` 관련 옵션들과 설정들을 바탕으로 전역 상태를 구성한뒤,
클라이언트를 `<trpc.Provider>` 와 `<QueryClientProvider>` 로 감싸주는 역할을 한다.

즉 전역적으로 `tRPC` 와 `React Query`를 동기화 시켜주는 역할을 하는 듯 하다.

### 사용하기

이렇게 서버와 클라이언트를 구성하고 나면, 서버에서 `procedure` 를 생성하면
자동적으로 클라이언트에 API 함수가 추가되고 이렇게 사용하면 된다.

```typescript title="pages/index.tsx" {4}
import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: 'client' });
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
```

이렇게 자동으로 생성된 API 함수들은 다음과 같이 세 가지 이점을 얻을 수 있다.

1. `procedure` 에 `input` 메소드에 정의된 타입의 객체를 전달받기를 기대한다.
2. `procedure`에 사용된 `query` 또는 `mutation` 함수에 맞춰서 매핑된다.
3. API 함수가 반환하는 `data` 는 `procedure`의 `output` 메소드에 정의된 타입과 매칭되도록 구성된다.

이러한 이점 덕에, `typesafe 한 E2E 환경을 쉽게` 구성할 수 있다고 이야기하는 것이다.
또 이전 서버 구성 단계에서 봤겠지만, `zod` 라이브러리를 사용하도록 공식적으로 권장하고 있고,
`tRPC`의 방식과도 궁합이 좋기 때문에 런타임에서도 `typesafe` 을 쉽게 유지할 수 있다는 장점이 있다.

## T3 stack

여기 까지의 과정을 살펴보면, 그렇게 크게 어려운 부분은 없다고 생각이 들지도 모르겠다.
그러나 상황이 복잡해지기 시작하면 실제 코드 베이스에서 고려하고 구성해야 될 부분이 많이 늘어나기 시작한다.

늘어나는 `procedure` 와 `router` 들의 관리라던가, 세션-쿠키 관리, `middleware` 를 통해 서버 콘텍스트를 관리하는 등,
여러 고민거리들이 라이브러리를 사용한다고 전부 해결되는 것이 아니기 때문이다.

오히려 추상화를 통해 한번 더 감춰지기 때문에 좀 더 복잡하게 느껴질 수 있다.
그리고 널리 오랫동안 사용되었던 라이브러리가 아니었기에 커뮤니티와 자료도 크지 않다는 것도 문제였다.

마지막으로 환경을 적절하게 구성하는데 필요한 보일러플레이트가 정말 적고 간단하다고는 말할 수 없는 것도 문제였다.

이러한 고민들을 좀 덜어줄 수 있는게 바로 `T3 Stack` 프로젝트이다.

개발자이자 유튜버인 Theo 가 자신의 풀스택 타입스크립트 프로젝트 환경을 구성하면서 필요한 기술 스택들을
`create-xx-app` 패키지로 구성해 프로젝트를 빠르게 시작할 수 있도록 스타터로 구성한 것이다.

해당 스타터를 통해 어플리케이션을 구성하면서 꼭 필요한 부분들에 대한 라이브러리 선택이 고민이 된다면,
한 번쯤 고려해봐도 좋을 듯 하다.

또한 환경을 구성하는데 필요한 보일러플레이트 코드와 설정에 대한 부담을 일정 부분 덜 수 있다는 이점이 있다.

나는 내가 선택하고자 했던 스택들이 거의 일치했고, `tRPC` 를 사용해보고 싶었으나 낯설었기 때문에 이 스타터를 통해 프로젝트를 보다 편하게 시작할 수 있었다.

## 느낌? 단점?

마지막으로 직접 사용하고 겪어보면서 느꼈던 실질적인 경험을 적고 마무리하면 좋을 것 같다.

`tRPC` 를 사용하면서 매우 많은 부분에서, 특히 매번 API 함수를 작성하지 않고 관리하지 않아도 된다는 점은 굉장한 장점이라고 다가왔다.

그러나 타입관리 부분에서는 마냥 좋다고만 이야기할 수 가 없는게, 자동으로 타입을 생성해주는 과정에서 라이브러리 내부 타입과
얽히는 부분이 있어서 이를 읽고, 수정하고 사용하기 마냥 편하지 만은 않았다는 것이다.

또한 에디터 상에서 타입 정보에 대한 업데이트가 즉각적으로 일어나지 않고 느리게 느껴지는 경우가 꽤 있었고,
에디터를 재시작해야 인식이 되는 경우도 종종 있었다.

마지막으로 SSR 관련해서 어떻게 구성해야하는 지 자세하게 설명되어있는 편이 아니고, 자료도 꽤 부족하기 때문에
이를 구현은 했으나 방법을 찾기 위해 꽤 헤맸던 기억이 있다.

클라이언트 레이어를 설정할 때의 `ssr` 값과, `Next` 의 `getServerSideProps`, react-query 를 활용한 `server-side-helpers`가
복합적으로 연결되어 있기 때문에 만약 SSR 이 렌더링 전략의 메인이라면 다시 한 번 생각해보는 것도 좋을 듯 하다.

그래도 마지막으로 정리하자면 **풀스택 모노레포 프로젝트에 한 번 도입을 생각해볼만한 좋은 대안** 이라는 말로 마치면 될 것 같다.
