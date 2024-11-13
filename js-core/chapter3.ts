// < 3 > This //
// [1-2] 메서드로서 호출할 때 그 메서드 내부에서의 this //

// 예제 3-6. 함수로서 호출, 메서드로서 호출
/** 
var func = function (x) {
  console.log(this, x);
};
// 함수로서 호출
func(1); // 전역 객체 window

var obj = {
  method: func,
};
// 메서드로서 호출
obj.method(2); // {method : f} 2 // 함수 앞에 점이 있으면 > 메서드로 호출한것임
*/

/***************************** */

// 예제 3-7. 메서드로서 호출 - 점 표기법, 대괄호 표기법
/** 
var obj = {
  method: function (x) {
    console.log(this, x);
  },
};

obj.method(1); // {method: f} 1
obj['method'](2) // {method: f} 2
*/

// 예제 3-8. 메서드 내부에서의 this
/**
var obj = {
  methodA: function () {
    console.log(this);
  },
  inner: {
    methodB: function () {
      console.log(this);
    },
  },
};
obj.methodA();
obj['methodA']();

obj.inner.methodB();
obj.inner['methodB']();
obj['inner'].methodB();
obj['inner']['methodB']();
*/

/***********************************************************/

// [1-3] 함수로서 호출할 때 그 함수 내부에서의 this //

// 예제 3-9. 내부함수에서의 this
/** 
var obj1 = {
  outer: function () {
    console.log(this); // (1)
    var innerFunc = function () {
      console.log(this); // (2) (3)
    };
    innerFunc();

    var obj2 = {
      innerMethod: innerFunc,
    };
    obj2.innerMethod();
  },
};
obj1.outer();
*/

/***************************** */

// 예제 3-10. 내부함수에서의 this를 우회하는 방법
/** 
var obj1 = {
  outer: function () {
    console.log(this); // (1)
    var innerFunc1 = function () {
      console.log(this); // (2) (3)
    };
    innerFunc1();

    var self = this;
    var innerFunc2 = function () {
      console.log(self); // (3) { outer: f }
    };
    innerFunc2();
  },
};
obj1.outer();
*/

/***************************** */

// 예제 3-11. this를 바인딩하지 않는 함수(화살표 함수)
/** 
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc();
  },
};
obj.outer();
*/

/***********************************************************/

// [1-4] 콜백 함수 호출 시 그 함수 내부에서의 this //

// 예제 3-12. 콜백 함수 내부에서의 this
/** 
setTimeout(function () {
  console.log(this); // (1)
}, 300);

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this, x); // (2)
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a').addEventListener('click', function (e) {
  console.log(this, e); // (3)
});
*/

/***********************************************************/

// [1-5] 생성자 함수 내부에서의 this //

// 예제 3-12. 콜백 함수 내부에서의 this
/** 
var Cat = function (name, age) {
  this.bark = '야옹';
  this.name = name;
  this.age = age;
};

var choco = new Cat('초코', 7);
var nabi = new Cat('나비', 5);
console.log(choco, nabi);
*/

/** 결과
Cat { bark: '야옹', name: '초코', age: 7 } 
Cat { bark: '야옹', name: '나비', age: 5 }
*/

/***********************************************************/

// [2-1] call 메서드 //

// 예제 3-14. call 메서드(1)
/** 
var func = function (a, b, c) {
  console.log(this, a, b, c);
};

func(1, 2, 3);
func.call({ x: 1 }, 4, 5, 6);
*/

/***************************** */

// 예제 3-15. call 메서드(2)
/** 
var obj = {
  a: 1,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};

obj.method(2, 3);
obj.method.call({ a: 4 }, 5, 6);
*/

/***********************************************************/

// [2-2] apply 메서드 //

// 예제 3-16. apply 메서드
/** 
var func = function (a, b, c) {
  console.log(this, a, b, c);
};
func.apply({ x: 1 }, [4, 5, 6]); // { x: 1 } 4 5 6

var obj = {
  a: 1,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};
obj.method.apply({ a: 4 }, [5, 6]); // 4 5 6
*/

/***********************************************************/

// [2-3] call / apply 메서드의 활용 //

// 예제 3-17. call/apply 메서드의 활용 1-1) 유사배열객체에 배열 메서드를 적용
/** 
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
Array.prototype.push.call(obj, 'd'); // { '0': 'a', '1': 'b', '2': 'c', '3': 'd', length: 4 }
console.log(obj);

var arr = Array.prototype.slice.call(obj);
console.log(arr); // [ 'a', 'b', 'c', 'd' ]
*/

/***************************** */

// 예제 3-18. call/apply 메서드의 활용 1-2) arguments, NodeList에 배열 메서드를 적용
/** 
function a() {
  var argv = Array.prototype.slice.call(arguments);
  argv.forEach(function (arg) {
    console.log(arg);
  });
}
a(1, 2, 3);

document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>';
var nodeList = document.querySelectorAll('div');
var nodeArr = Array.prototype.slice.call(nodeList);
nodeArr.forEach(function (node) {
  console.log(node);
});
*/

/***************************** */

// 예제 3-19. call/apply 메서드의 활용 1-3) 문자열에 배열 메서드 적용 예시
/** 
var str = 'abc def';

// Array.prototype.push.call(str, ', pushed string'); // TypeError: Cannot assign to read only property 'length' of object '[object String]'

Array.prototype.concat.call(str, 'string');

Array.prototype.every.call(str, function (char) {
  return char !== '';
}); // false

Array.prototype.some.call(str, function (char) {
  return char === '';
}); // true

var newArr = Array.prototype.map.call(str, function (char) {
  return char + '!';
});
console.log(newArr); // ['a!', 'b!', 'c!', ' !', 'd!', 'e!', 'f!' ]

var newStr = Array.prototype.reduce.apply(str, [
  function (string, char, i) {
    return string + char + i;
  },
  '',
]);

console.log(newStr);
*/

/***************************** */

// 예제 3-20. call/apply 메서드의 활용 1-4) ES6의 Array.from 메서드
/** 
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
var arr = Array.from(obj);
console.log(arr); // ['a', 'b', 'c'];
*/

/***************************** */

// 예제 3-21. call/apply 메서드의 활용 2) 생성자 내부에서 다른 생성자를 호출
/** 
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}
function Student(name, gender, school) {
  Person.call(this, name, gender);
  this.school = school;
}
function Employee(name, gender, company) {
  Person.apply(this, [name, gender]);
  this.company = company;
}

var by = new Student('보영', 'female', '단국대');
var jn = new Employee('재넌', 'male', '구글');

console.log(by); // Student { name: '보영', gender: 'female', school: '단국대' }
console.log(jn); // Employee { name: '재넌', gender: 'male', company: '구글' }
*/

/***************************** */

// 예제 3-22. call/apply 메서드의 활용 3-1) 최대 / 최솟값을 구하는 코드를 직접 구현 (AS-IS)
/** 
var numbers = [10, 20, 3, 16, 45];
var max = (min = numbers[0]);
numbers.forEach(function (number) {
  if (number > max) {
    max = number;
  }
  if (number < min) {
    min = number;
  }
});

console.log(max, min);
*/

/***************************** */

// 예제 3-23. call/apply 메서드의 활용 3-2) 여러 인수를 받는 메서드(Math.max/Math.min)에 apply를 적용 (TO-BE)
/** 
var numbers = [10, 20, 3, 16, 45];
var max = Math.max.apply(null, numbers);
var min = Math.min.apply(null, numbers);
console.log(max, min);
*/

/***************************** */

// 예제 3-24. call/apply 메서드의 활용 3-3) ES6의 펼치기 연산자 활용
/** 
const numbers = [10, 20, 3, 16, 45];
const max = Math.max(...numbers);
const min = Math.min(...numbers);
console.log(max, min);
*/

/***********************************************************/

// [2-4] bind 메서드 //

// 예제 3-25. bind 메서드 - this 지정과 부분 적용 함수 구현
/** 
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};
func(1, 2, 3, 4);

var bindFunc1 = func.bind({ x: 1 });
bindFunc1(5, 6, 7, 8);

var bindFunc2 = func.bind({ x: 1 }, 4, 5);
bindFunc2(6, 7);
bindFunc2(8, 9);
*/

/***************************** */

// 예제 3-26. bind 메서드 - name 프로퍼티
/** 
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};
var bindFunc = func.bind({ x: 1 }, 4, 5);

console.log(func.name); // func
console.log(bindFunc.name); // bound func
*/

/***************************** */

// 예제 3-27. 내부함수에 this 전달 - call vs bind
/** 
// call 방식
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    };
    innerFunc.call(this);
  },
};
obj.outer();

// bind 방식
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    }.bind(this);
    innerFunc();
  },
};
obj.outer();
*/

/***************************** */

// 예제 3-28. bind 메서드 - 내부함수에 this 전달
/** 
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};
var bindFunc = func.bind({ x: 1 }, 4, 5);

console.log(func.name); // func
console.log(bindFunc.name); // bound func
*/

/***********************************************************/

// [2-5] 화살표 함수의 예외사항 //

// 예제 3-29. 화살표 함수 내부에서의 this
/** 
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc();
  },
};
obj.outer();
*/

/***********************************************************/

// [2-6] 별도의 인자로 this를 받는 경우 (콜백 함수 내에서의 this) //

// 예제 3-30. thisArg를 받는 경우 예시 - forEach 메서드
/** 
var report = {
  sum: 0,
  count: 0,
  add: function () {
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function (entry) {
      this.sum += entry;
      ++this.count;
    }, this);
  },
  average: function () {
    return this.sum / this.count;
  },
};

report.add(60, 85, 95);
console.log(report.sum, report.count, report.average());
*/

/***********************************************************/
