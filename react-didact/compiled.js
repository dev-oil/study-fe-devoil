function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === "object" ? child : createTextElement(child))
    }
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

// 6-6. Fiber를 기반으로 DOM 노드 생성
function createDom(fiber) {
  // 수정: element가 아닌 fiber 참조로 변경
  const dom = fiber.type == "TEXT_ELEMENT" // fiber의 type이 TEXT_ELEMENT이면 텍스트 노드 생성
  ? document.createTextNode(fiber.props.nodeValue || "") : document.createElement(fiber.type); // 일반 DOM 노드 생성

  // 수정: DOM 속성 초기화를 위해 updateDom 호출
  updateDom(dom, {}, fiber.props);
  return dom;
}

// 6-7. 6-6의 작업은 updateDom 이라는 함수에서 수행
// 갱신을 위해 사용하는 이벤트 리스너
const isEvent = key => key.startsWith("on");
const isProperty = key => key !== "children" && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps).filter(isEvent).filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key)).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  // Remove old properties
  Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach(name => {
    dom[name] = "";
  });

  // Set new or changed properties
  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => {
    dom[name] = nextProps[name];
  });

  // Add event listeners
  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {
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
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// render 함수에서 fiber 트리의 루트에 nextUnitOfWork 함수 설정
function render(element, container) {
  // 5-2. fiber 트리의 루트를 추적
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    // 6-3. 모든 fiber에 alternate라는 속성을 추가 : 이전의 커밋 단계에서 DOM에 추가했던 오래된 fiber에 대한 링크
    alternate: currentRoot
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
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 5-1. dom 변형 부분 제거 fiber.parents

  // 각각의 자식들마다 새로운 fiber 생성
  const elements = fiber.props.children;

  // 6-3. 이제 새로운 fiber를 생성하는 코드를 performUnitOfWork에서 추출해서 reconcileChildren 함수 생성
  reconcileChildren(fiber, elements);
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
        effectTag: "UPDATE"
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
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
  render
};

/** @jsx Didact.createElement */
const container = document.getElementById("root");
const updateValue = e => {
  rerender(e.target.value);
};
const rerender = value => {
  const element = Didact.createElement("div", null, Didact.createElement("input", {
    onInput: updateValue,
    value: value
  }), Didact.createElement("h2", null, "Hello ", value));
  Didact.render(element, container);
};
rerender("World");
