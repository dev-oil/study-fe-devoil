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
function createDom(fiber) {
  const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
  const isProperty = key => key !== "children";
  Object.keys(element.props).filter(isProperty).forEach(name => {
    dom[name] = element.props[name];
  });
  return dom;
}

// render 함수에서 fiber 트리의 루트에 nextUnitOfWork 함수 설정
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
}
let nextUnitOfWork = null;

// 준비를 마친 브라우저가 workLoop를 호출하면, 루트에서부터 작업 시작
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
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
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };

    // 첫 번째 자식인지 아닌지에 따라 자식 혹은 형제 자매로서 fiber 트리에 추가
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  // 탐색작업 (탐색 순서: 자식 -> 형제자매 -> 부모의 형제자매 순서)
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
const Didact = {
  createElement,
  render
};

/** @jsx Didact.createElement */
function App(props) {
  return Didact.createElement("h1", null, "Hi ", props.name);
}
const element = Didact.createElement(App, {
  name: "foo"
});
const container = document.getElementById("root");
Didact.render(element, container);
