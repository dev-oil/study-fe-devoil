// JSX 문법을 Virtual DOM으로 변환하는 함수
function createElement(type, props, ...children) {
  return {
    type, // 요소의 타입 (ex: 'div', 'h1', 'p' 등)
    props: {
      ...props, // 전달받은 속성들을 복사
      children: children.map((child) =>
        // children 배열을 순회하며 텍스트와 객체를 구분하여 처리
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT', // 텍스트 노드임을 나타내는 고유 타입
    props: {
      nodeValue: text, // 텍스트 값 저장
      children: [], // 텍스트 노드는 자식이 없기 때문에 빈 배열
    },
  };
}

// fiber로부터 실제 DOM 노드를 생성하는 함수
function createDom(fiber) {
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('') // 텍스트 노드인 경우 텍스트 노드 생성
      : document.createElement(fiber.type); // 일반 노드인 경우, 태그 이름에 해당하는 DOM 노드 생성

  updateDom(dom, {}, fiber.props); // DOM 노드에 속성을 추가하거나 갱신

  return dom; // 생성된 DOM 노드를 반환
}

const isEvent = (key) => key.startsWith('on'); // 이벤트 핸들러인지 확인
const isProperty = (key) => key !== 'children' && !isEvent(key); // 일반 속성을 필터링하는 함수. 'children' 속성과 이벤트 리스너는 제외함
const isNew = (prev, next) => (key) => prev[key] !== next[key]; // 이전 props와 새로운 props를 비교하여 값이 달라진 속성을 반환
const isGone = (prev, next) => (key) => !(key in next); // 이전 props에는 있었으나 새로운 props에 없는 속성을 필터링함

// 이전과 새로운 props를 비교하여 DOM을 업데이트 하는 함수
function updateDom(dom, prevProps, nextProps) {
  // 1. 이전 이벤트 리스너 제거
  Object.keys(prevProps)
    .filter(isEvent) // 이전 속성 중 이벤트 리스너만 필터링
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)) // 새로운 props에 없거나 변경된 리스너만 남김
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2); // 'onClick' -> 'click'
      dom.removeEventListener(eventType, prevProps[name]); // 기존 이벤트 리스너 제거
    });

  // 2. 이전 속성 제거
  Object.keys(prevProps)
    .filter(isProperty) // 일반 속성만 필터링
    .filter(isGone(prevProps, nextProps)) // 제거된 속성만 남김
    .forEach((name) => {
      dom[name] = ''; // 제거된 속성을 초기화 (속성 제거)
    });

  // 3. 새로운 속성 추가 또는 변경
  Object.keys(nextProps)
    .filter(isProperty) // 일반 속성만 필터링
    .filter(isNew(prevProps, nextProps)) // 새로 추가되었거나 변경된 속성만 남김
    .forEach((name) => {
      dom[name] = nextProps[name]; // 새로운 속성을 DOM에 적용
    });

  // 4. 새로운 이벤트 리스너 추가
  Object.keys(nextProps)
    .filter(isEvent) // 이벤트 리스너만 필터링
    .filter(isNew(prevProps, nextProps)) // 새로 추가된 리스너만 남김
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2); // 'onClick' -> 'click'으로 변환
      dom.addEventListener(eventType, nextProps[name]); // 새로운 이벤트 리스너 추가
    });
}

// 작업이 완료된 Fiber 트리를 실제 DOM에 반영하는 함수
function commitRoot() {
  // 1. 삭제할 작업(deletions)을 모두 DOM에 반영
  deletions.forEach(commitWork); // 삭제할 작업이 있으면 commitWork로 처리

  // 2. 작업 루트(wipRoot)의 첫 번째 자식부터 DOM에 반영
  commitWork(wipRoot.child);

  // 3. 현재 커밋된 루트(currentRoot)를 갱신
  currentRoot = wipRoot;

  // 4. 작업 중인 루트(wipRoot)를 초기화
  wipRoot = null;
}

// 개별 Fiber 노드를 DOM에 추가, 업데이트, 삭제하는 함수
function commitWork(fiber) {
  if (!fiber) {
    return; // fiber가 없으면 종료
  }

  // 1. 부모 DOM을 찾음
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent; // 부모가 DOM을 가질 때까지 반복
  }
  const domParent = domParentFiber.dom; // 실제 DOM 부모 노드를 가져옴

  // 2. 작업 타입에 따라 DOM에 반영
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    // 새로운 요소 추가
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    // 기존 요소 업데이트
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    // 요소 삭제
    commitDeletion(fiber, domParent);
  }

  // 3. 자식과 형제 노드에 대해 재귀적으로 커밋 작업 수행
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    // 현재 fiber에 연결된 DOM 노드가 있으면 부모에서 제거
    domParent.removeChild(fiber.dom);
  } else {
    // 현재 fiber에 DOM 노드가 없을 경우, 자식 노드를 재귀적으로 탐색하여 제거
    commitDeletion(fiber.child, domParent);
  }
}

// 루트 컨테이너에 Virtual DOM을 렌더링하는 함수
function render(element, container) {
  // 새로운 작업 루트(wipRoot)를 설정
  wipRoot = {
    dom: container, // 실제 DOM 컨테이너
    props: {
      children: [element], // 렌더링할 요소를 자식으로 설정
    },
    alternate: currentRoot, // 이전 루트와 비교를 위해 alternate 설정
  };

  deletions = []; // 삭제할 작업 초기화
  nextUnitOfWork = wipRoot; // 첫 번째 작업 단위로 wipRoot 설정
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

// Fiber 알고리즘의 핵심 루프
// 작업을 나눠서 처리하고, 모든 작업이 끝나면 DOM에 반영
function workLoop(deadline) {
  let shouldYield = false; // 브라우저가 제어권을 가져가야 하는 지 여부

  // 남은 시간이 있는 동안 작업 단위를 수행
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 작업 단위 수행
    shouldYield = deadline.timeRemaining() < 1; // 브라우저가 제어권을 가져갈 시간이 부족하면 루프 종료
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot(); // 모든 작업이 완료되었으면 DOM에 반영
  }

  requestIdleCallback(workLoop); // 브라우저가 유휴 시간에 다시 호출하도록 설정
}

requestIdleCallback(workLoop);

// 함수형 컴포넌트를 호출하고 반환된 Virtual DOM으로 새로운 Fiber 트리 생성
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function; // 함수형 컴포넌트인지 확인

  if (isFunctionComponent) {
    updateFunctionComponent(fiber); // 함수형 컴포넌트 업데이트
  } else {
    updateHostComponent(fiber); // 일반 DOM 컴포넌트 업데이트
  }

  // 자식이 있으면 다음 작업 단위로 반환
  if (fiber.child) {
    return fiber.child;
  }

  // 형제나 부모의 형제를 찾는 루프
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling; // 형제가 있으면 다음 작업 단위로 반환
    }
    nextFiber = nextFiber.parent; // 부모로 이동하여 탐색
  }
}

let wipFiber = null;
let hookIndex = null;

// 함수형 컴포넌트를 호출하고 반환된 Virtual DOM으로 새로운 Fiber 트리 생성
function updateFunctionComponent(fiber) {
  // 함수형 컴포넌트 업데이트를 위해 현재 작업 중인 fiber와 훅 인덱스를 초기화
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = []; // 훅 배열 초기화

  // 함수형 컴포넌트를 호출하여 새로운 Virtual DOM을 생성
  const children = [fiber.type(fiber.props)];

  // 생성된 Virtual DOM을 자식으로 조정
  reconcileChildren(fiber, children);
}

function useState(initial) {
  // 이전 훅(oldHook)을 가져옴
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  // 현재 훅(hook)을 생성
  const hook = {
    state: oldHook ? oldHook.state : initial, // 이전 상태가 있으면 재사용, 없으면 초기값 사용
    queue: [], // 상태 업데이트 대기열
  };

  // 대기열에 있는 모든 액션을 처리하여 새로운 상태를 계산
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state); // 각 액션을 실행하여 새로운 상태를 계산
  });

  // 상태를 업데이트하는 함수
  const setState = (action) => {
    hook.queue.push(action); // 새로운 액션을 대기열에 추가
    wipRoot = {
      dom: currentRoot.dom, // 현재 DOM 루트
      props: currentRoot.props, // 현재 속성
      alternate: currentRoot, // 이전 루트를 alternate로 참조
    };
    nextUnitOfWork = wipRoot; // 새 작업 루트를 설정하여 재렌더링을 트리거
    deletions = []; // 삭제할 작업 초기화
  };

  // 현재 훅을 fiber에 추가
  wipFiber.hooks.push(hook);
  hookIndex++; // 다음 훅을 위해 인덱스 증가

  return [hook.state, setState]; // 상태와 상태를 업데이트 하는 함수 반환
}

// 일반 DOM 컴포넌트를 처리하여 DOM 노드를 생성하고 자식 요소들을 Fiber 구조로 연결
function updateHostComponent(fiber) {
  // fiber에 DOM 노드가 없으면 생성
  if (!fiber.dom) {
    fiber.dom = createDom(fiber); // DOM 노드를 생성하여 fiber에 연결
  }

  // 자식 요소들을 fiber 구조로 변환하고 연결
  reconcileChildren(fiber, fiber.props.children);
}

// 새 요소와 이전 Fiber를 비교하여 필요한 작업(업데이트, 추가, 삭제)을 결정하고 새로운 Fiber 트리를 생성
function reconcileChildren(wipFiber, elements) {
  let index = 0; // 자식 요소 인덱스
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 이전 fiber의 첫 번째 자식
  let prevSibling = null; // 이전 형제 fiber를 저장할 변수

  // 새 요소와 이전 fiber를 비교하면서 새로운 fiber를 생성
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]; // 새로 추가된 요소
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type; // 이전 fiber와 새 요소의 타입이 같으면 업데이트로 판단

    if (sameType) {
      // 같은 타입이면 기존 DOM을 재사용하고 속성만 업데이트
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE', // 업데이트 작업으로 태그 설정
      };
    }

    if (element && !sameType) {
      // 타입이 다르면 새로운 요소로 간주하고 새 fiber 생성
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT', // 새로 추가된 요소로 태그 설정
      };
    }

    if (oldFiber && !sameType) {
      // 타입이 다르면 이전 요소를 삭제할 작업에 추가
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber); // 삭제할 fiber를 deletions 배열에 추가가
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling; // 다음 형제 fiber로 이동
    }

    if (index === 0) {
      // 첫 번째 자식이면 부모의 child로 설정
      wipFiber.child = newFiber;
    } else if (element) {
      // 첫 번째 자식이 아니면 이전 형제의 sibling으로 설정
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber; // 이전 형제 fiber를 현재 fiber로 갱신
    index++;
  }
}

function memo(Component) {
  // memo로 감싼 컴포넌트를 반환
  return function MemoizedComponent(props) {
    // 현재 작업 중인 fiber(wipFiber)에서 이전 렌더링 정보(alternate)가 있는지 확인
    if (wipFiber.alternate) {
      const oldProps = wipFiber.alternate.props; // 이전 렌더링의 props 가져오기
      const isSameProps = shallowEqual(oldProps, props); // 이전 props와 현재 props 비교

      if (isSameProps) {
        // props가 동일하면 이전 DOM을 반환하여 재렌더링 방지
        return wipFiber.alternate.dom;
      }
    }

    // props가 변경되었거나 이전 렌더링 정보가 없으면 컴포넌트를 새로 렌더링
    return Component(props);
  };
}

// 얕은 비교 함수: 두 객체의 속성을 비교하여 동일한지 확인
function shallowEqual(objA, objB) {
  const keysA = Object.keys(objA); // objA의 모든 키를 배열로 반환
  const keysB = Object.keys(objB); // objB의 모든 키를 배열로 반환

  // 키의 개수가 다르면 다른 객체로 간주하고 false 반환
  if (keysA.length !== keysB.length) return false;

  // 모든 키에 대해 값을 비교하여 하나라도 다르면 false 반환
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }

  // 모든 키의 값이 같으면 true 반환
  return true;
}

function useMemo(factory, deps) {
  // 이전 훅(oldHook)을 가져옴: 현재 fiber(wipFiber)의 이전 렌더링 정보에서 hooks 배열을 참조
  const oldHook =
    wipFiber.alternate && // 이전 fiber가 존재하고
    wipFiber.alternate.hooks && // 이전 fiber에 hooks 배열이 존재하며
    wipFiber.alternate.hooks[hookIndex]; // 현재 훅 인덱스에 해당하는 훅이 존재하면 가져옴

  // hasChanged: 의존성 배열(deps)을 비교하여 값이 변경되었는지 판단
  const hasChanged = oldHook ? !shallowEqual(oldHook.deps, deps) : true;

  // 새로운 훅 객체 생성
  const hook = {
    // 값이 변경되었으면 factory 함수를 호출하여 새로운 값을 계산, 변경되지 않았으면 이전 값을 재사용
    memoizedValue: hasChanged ? factory() : oldHook.memoizedValue,
    deps, // 현재 의존성 배열 저장
  };

  // 현재 훅을 fiber의 훅 배열에 추가
  wipFiber.hooks.push(hook);
  hookIndex++; // 다음 훅을 위해 인덱스 증가

  // 메모이제이션된 값을 반환
  return hook.memoizedValue;
}

const Didact = {
  createElement,
  render,
  useState,
  memo,
  useMemo,
};

/** @jsx Didact.createElement */

// Counter 예제
// function Counter() {
//   const [state, setState] = Didact.useState(1);
//   return (
//     <h1 onClick={() => setState((c) => c + 1)} style='user-select: none'>
//       Count: {state}
//     </h1>
//   );
// }
// const element = <Counter />;
// const container = document.getElementById('root');
// Didact.render(element, container);

// memo 예제 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 일반 컴포넌트
// function Counter({ count }) {
//   console.log('Counter 렌더링');
//   return <h1>Count: {count}</h1>;
// }

// // memo로 감싸서 메모이제이션
// const MemoizedCounter = Didact.memo(Counter);

// // App 컴포넌트
// function App() {
//   const [count, setCount] = Didact.useState(0);
//   const [text, setText] = Didact.useState('');

//   return (
//     <div>
//       <button onClick={() => setCount((c) => c + 1)}>Increment</button>
//       <input value={text} onChange={(e) => setText(e.target.value)} />
//       <MemoizedCounter count={count} />
//     </div>
//   );
// }

// const container = document.getElementById('root');
// Didact.render(<App />, container);

// useMemo 예제 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 비용이 큰 계산을 하는 컴포넌트
function ExpensiveComponent({ value }) {
  const expensiveCalculation = Didact.useMemo(() => {
    console.log('Expensive calculation');
    return value * 2;
  }, [value]);

  return <div>Result: {expensiveCalculation}</div>;
}

// App 컴포넌트
function App() {
  const [count, setCount] = Didact.useState(0);
  const [text, setText] = Didact.useState('');

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ExpensiveComponent value={count} />
    </div>
  );
}

const container = document.getElementById('root');
Didact.render(<App />, container);
