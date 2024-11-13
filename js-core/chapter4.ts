// < 4 > 콜백 함수 //
// [2-1] 제어권 - 호출 시점 //

// 예제 4-1. 콜백 함수 예제 (1-1) setInterval
/** 
var count = 0;
var timer = setInterval(function () {
  console.log(count);
  if (++count > 4) clearInterval(timer);
}, 300);
*/

/***************************** */

// 예제 4-2. 콜백 함수 예제 (1-2) setInterval
/** 
var count = 0;
var cbFunc = function () {
  console.log(count);
  if (++count > 4) clearInterval(timer);
};

var timer = setInterval(cbFunc, 300);
*/

/***********************************************************/

// [2-2] 제어권 - 인자 //

// 예제 4-3. 콜백 함수 예제 (2-1) Array.prototype.map
/** 
var newArr = [10, 20, 30].map(function (currentValue, index) {
  console.log(currentValue, index);
  return currentValue + 5;
});

console.log(newArr);
*/

/***********************************************************/

// [2-3] 제어권 - this //

// 예제 4-5. 콜백 함수 예제 (2-3) Array.prototype.map - 구현
/** 
Array.prototype.map = function (callback, thisArg) {
  var mappedArr = [];
  for (var i = 0; i < this.length; i++) {
    var mappedValue = callback.call(thisArg || window, this[i], i, this);
    mappedArr[i] = mappedValue;
  }
  return mappedArr;
};
*/

/***************************** */

// 예제 4-6. 콜백 함수 내부에서의 this
/** 
setTimeout(function () {
  console.log(this); // window
}, 300);

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this); // window
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a').addEventListener('click', function (e) {
  console.log(this, e); // <button id="a">클릭</button>
});
*/

/***********************************************************/

// [3] 콜백 함수는 함수다 //

// 예제 4-7. 메서드를 콜백 함수로 전달한 경우
/** 
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  },
};
obj.logValues(1, 2); // { vals: [ 1, 2, 3 ], logValues: [Function: logValues] } 1 2
[4, 5, 6].forEach(obj.logValues); // Window { ... } 4 0 Window { ... } 5 1 Window { ... } 6 2

// 어떤 함수의 인자에 객체의 메서드를 전달하더라도 이는 결국 메서드가 아닌 함수일 뿐.
*/

/***********************************************************/

// [4] 콜백 함수 내부의 this에 다른 값 바인딩하기 //

// 예제 4-8. 콜백 함수 내부의 this에 다른 값을 바인딩하는 방법(1) - 전통적인 방식
/**
var obj1 = {
  name: 'obj1',
  func: function () {
    var self = this;
    return function () {
      console.log(self.name);
    };
  },
};
var callback = obj1.func();
setTimeout(callback, 1000);
*/

/***************************** */

// 예제 4-9. 콜백 함수 내부에서 this를 사용하지 않은 경우
/**
var obj1 = {
  name: 'obj1',
  func: function () {
    console.log(obj1.name);
  },
};
setTimeout(obj1.func, 1000);
*/

/***************************** */

// 예제 4-11. 콜백 함수의 this에 다른 값을 바인딩 하는 방법(2) - bind 메서드 활용
/**
var obj1 = {
  name: 'obj1',
  func: function () {
    console.log(this.name);
  },
};
setTimeout(obj1.func.bind(obj1), 1000);

var obj2 = { name: 'obj2' };
setTimeout(obj1.func.bind(obj2), 1500);
*/

/***********************************************************/

// [5] 콜백 지옥과 비동기 제어 //

// 예제 4-12. 콜백 지옥 예시 (1-1)
/**
setTimeout(
  function (name) {
    var coffeeList = name;
    console.log(coffeeList);

    setTimeout(
      function (name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);

        setTimeout(
          function (name) {
            coffeeList += ', ' + name;
            console.log(coffeeList);

            setTimeout(
              function (name) {
                coffeeList += ', ' + name;
                console.log(coffeeList);
              },
              500,
              '카페라떼'
            );
          },
          500,
          '카페모카'
        );
      },
      500,
      '아메리카노'
    );
  },
  500,
  '에스프레소'
);
*/

/***************************** */

// 예제 4-13. 콜백 지옥 해결 - 기명함수로 변환
/**
var coffeeList = '';

var addEspresso = function (name) {
  coffeeList = name;
  console.log(coffeeList);
  setTimeout(addAmericano, 500, '아메리카노');
};

var addAmericano = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addMocha, 500, '카페모카');
};

var addMocha = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addLatte, 500, '카페라떼');
};

var addLatte = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
};

setTimeout(addEspresso, 500, '에스프레소');
*/

/***************************** */

// 예제 4-14. 비동기 작업의 동기적 표현(1) - promise(1)
/**
new Promise(function (resolve) {
  setTimeout(function () {
    var name = '에스프레소';
    console.log(name);
    resolve(name);
  }, 500);
})
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = prevName + ', 아메리카노';
        console.log(name);
        resolve(name);
      }, 500);
    });
  })
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = prevName + ', 카페모카';
        console.log(name);
        resolve(name);
      }, 500);
    });
  })
  .then(function (prevName) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var name = prevName + ', 카페라떼';
        console.log(name);
        resolve(name);
      }, 500);
    });
  });
*/

/***************************** */

// 예제 4-15. 비동기 작업의 동기적 표현(2) - promise(2)
/**
var addCoffee = function (name) {
  return function (prevName) {
    // 클로저 (?)
    return new Promise(function (resolve) {
      setTimeout(function () {
        var newName = prevName ? prevName + ', ' + name : name;
        console.log(newName);
        resolve(newName);
      }, 500);
    });
  };
};

addCoffee('에스프레소')()
  .then(addCoffee('아메리카노'))
  .then(addCoffee('카페모카'))
  .then(addCoffee('카페라떼'));
*/

/***************************** */

// 예제 4-16. 비동기 작업의 동기적 표현(3) - generator
/**
var addCoffee = function (prevName, name) {
  setTimeout(function () {
    coffeeMaker.next(prevName ? prevName + ', ' + name : name);
  }, 500);
};

var coffeeGenerator = function* () {
  var espresso = yield addCoffee('', '에스프레소');
  console.log(espresso);
  var americano = yield addCoffee(espresso, '아메리카노');
  console.log(americano);
  var mocha = yield addCoffee(americano, '카페모카');
  console.log(mocha);
  var latte = yield addCoffee(mocha, '카페라떼');
  console.log(latte);
};
var coffeeMaker = coffeeGenerator();
coffeeMaker.next();
*/

/***************************** */

// 예제 4-17. 비동기 작업의 동기적 표현(4) - promise + Async/await
/**
var addCoffee = function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 500);
  });
};

var coffeeMaker = async function () {
  var coffeeList = '';
  var _addCoffee = async function (name) {
    coffeeList += (coffeeList ? ', ' : '') + (await addCoffee(name));
  };
  await _addCoffee('에스프레소');
  console.log(coffeeList);
  await _addCoffee('아메리카노');
  console.log(coffeeList);
  await _addCoffee('카페모카');
  console.log(coffeeList);
  await _addCoffee('카페라떼');
  console.log(coffeeList);
};
coffeeMaker();
*/
