function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// 6-6. Fiber를 기반으로 DOM 노드 생성
function createDom(fiber) {
  // 수정: element가 아닌 fiber 참조로 변경
  const dom =
    fiber.type == 'TEXT_ELEMENT' // fiber의 type이 TEXT_ELEMENT이면 텍스트 노드 생성
      ? document.createTextNode(fiber.props.nodeValue || '')
      : document.createElement(fiber.type); // 일반 DOM 노드 생성

  // 수정: DOM 속성 초기화를 위해 updateDom 호출
  updateDom(dom, {}, fiber.props);

  return dom;
}

// 6-7. 6-6의 작업은 updateDom 이라는 함수에서 수행
// 갱신을 위해 사용하는 이벤트 리스너
const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 5-3. 다음 작업이 없는 경우 전체 fiber 트리 DOM에 커밋
function commitRoot() {
  deletions.forEach(commitWork);
  // 6-1. 노드 갱신과 삭제
  commitWork(wipRoot.child);
  // 6-2. 마지막으로 DOM에 커밋된 fiber 트리를 저장하는 currentRoot
  currentRoot = wipRoot;
  wipRoot = null;
}

// 6-1. 노드 갱신과 삭제
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 수정: 부모 DOM을 안전하게 탐색
  // 7-2. DOM 노드의 부모를 찾으려면 DOM 노드를 가진 fiber를 찾을 때까지 fiber 트리의 상단으로 올라감
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 7-3. 노드를 제거할 때도 동일하게, DOM 노드를 가진 자식을 찾을 때까지 탐색을 수행
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// render 함수에서 fiber 트리의 루트에 nextUnitOfWork 함수 설정
function render(element, container) {
  // 5-2. fiber 트리의 루트를 추적
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 6-3. 모든 fiber에 alternate라는 속성을 추가 : 이전의 커밋 단계에서 DOM에 추가했던 오래된 fiber에 대한 링크
    alternate: currentRoot,
  };
  // 6-6. 제거하고 싶은 노드 추적을 위한 배열
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

// 준비를 마친 브라우저가 workLoop를 호출하면, 루트에서부터 작업 시작
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 5-3. 다음 작업이 없는 경우 전체 fiber 트리 DOM에 커밋
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 새로운 노드 생성, DOM에 추가
function performUnitOfWork(fiber) {
  // 7-1. 함수형 컴포넌트 추가 지원
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 8-3. 함수형 컴포넌트를 호출하기 전 useState 함수의 내부에서 사용하기 위한 몇몇 전역 변수 초기화
let wipFiber = null;
let hookIndex = null;

// 7-2. updateFunctionComponent 에서는 자식 요소를 얻는 함수를 실행함
// 8-2. Counter 함수를 호출하는 부분. 그리고 그 함수 내부에서 useState를 호출
function updateFunctionComponent(fiber) {
  // 8-3. 그 fiber에 hooks 배열을 추가함으로서 동일한 컴포넌트에서 여러 번 useState 함수를 호출 할 수 있도록함
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  // 8-4. 함수형 컴포넌트가 useState를 호출할 때 이것이 오래된 hook인지를 체크하는데, 이때 훅 인덱스를 사용하여 fiber의 alternate를 체크,

  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  // 8-4. 만약 우리가 가지고 있는 것이 오래된 hook이라면 상태를 초기화하지 않았을 경우 이 훅의 상태를 새로운 훅으로 복사
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  // 8-6. 컴포넌트 렌더링 다음에 수행, 오래된 훅의 큐에서 모든 액션을 가져온 다음 이를 새로운 훅 state에 하나씩 적용하면 갱신된 state를 얻을 수 있게 됨
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  // 8-5. 또한 useState는 상태를 갱신하는 함수 역시 리턴해야 하므로, 액션을 받는 setState 함수를 정의
  const setState = (action) => {
    // 8-5. 이 액션을 우리가 훅에 추가한 큐에 넣음
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  // 8-4. 그리고 새로운 훅을 fiber에 추가한 뒤 훅 인덱스 값을 증가시킨 다음 state를 반환
  // 8-5. 그리고 render 함수에서 했던 것과 비슷한 작업을 하는데, 새로운 작업 중(wip)인 루트를 다음 작업할 단위로 설정하여 반복문에서 새로운 렌더 단계를 시작할 수 있도록 함
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// 7-2. updateHostComponent > 이전과 동일한 일을 함
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 6-3. 이제 새로운 fiber를 생성하는 코드를 performUnitOfWork에서 추출해서 reconcileChildren 함수 생성
// 오래된 fiber를 새로운 엘리먼트로 재조정(reconcile)
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  render,
  useState,
};

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  // 8-1. 카운터를 클릭할 때마다, state를 1씩 추가
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

// memo, useMemo

// const element = <Counter />;
// const container = document.getElementById('root');
// Didact.render(element, container);

// <Button title="foo" />
// React.createElement(Button)
// // Button ; 컴포넌트 = props를 인자로 받아서 엘리먼트를 리턴하는 함수
// // <Button /> !: div 엘리먼트 = 프롭스에다가 <> 씌워놓은거
// // <
// function Button() {
//   return <Box></Box>
// }

// function add(x, y) {
//   return x + y;
// }

// <Button />