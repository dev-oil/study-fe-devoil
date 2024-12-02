// 3주차 숙제
// [class version]
`class Dog {
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sleep() {
    console.info("sleep")
  }
}

class Poodle extends Dog{
  constructor(name: string, age: number, color : string) {
    super(name, age)
    this.color = color;
  }
  
  swim() {
    console.info("swim")
  }
}

const happy = new Poodle();

console.log(happy);
happy.swim();`

// [prototype version]
function Dog(name: string, age: number) {
  this.name = name;
  this.age = age;
}

function Poodle(name: string, age: number, color: string) {
  Dog.call(this, name, age); // call로 상속 > class super(name, string)
  this.color = color;
}

// dynamic, 동적
Poodle.prototype = Object.create(Dog.prototype); // Poodle의 프로토타입을 Dog에 연결. 상속해줌



const happy = new Poodle('coco', 1, 'brown');

console.log(happy)
happy.swim();

// 상속도 확인하는 법 (instanceof)
console.log(happy instanceof Poodle); // true
console.log(happy instanceof Dog); // true

// 4주차 수업 내역
// Math.trunc() vs Math.ceil() / Math.floor()
// // 조건이 따로 없다면, 정수를 만들 때 Math.trunc()를 사용하는 것이 맞는지 궁금합니다.
// // 프로그래머스에서는 다들 다양하게 사용하는 것 같아서 질문 드립니다.
// // trunc
// Math.trunc(4.9);  // 4
// Math.trunc(-4.9); // -4

// // ceil 
// Math.ceil(4.1);  // 5
// Math.ceil(-4.1); // -4

// // floor
// Math.floor(4.9);  // 4
// Math.floor(-4.9); // -5

// // Math.floor Math.trunc

// const sliceCount = 10
// const peopleCount = 3
// Math.floor(sliceCount / peopleCount)  === 3
// Math.floor(-4.9)===-5 <= -4.9

// 내가 먹어야하는 피자조각 = Math.floor(x) <= x
// ceil = Math.ceil(x) >= x

// Math.floor(x)는 x 이하의 가장 큰 정수
// Math.ceil(x)는 x 이상의 가장 작은 정수

// const x = f()
// const y = Math.trunc(x) // x,y>=0 -> y <= x

// const z = x - y // x,y>=0 -> z >= 0

// // [AS-IS] 배열 내 딸기를 키위로 변경하는 함수 만들기 (일반 버전)

function replace(array, from, to) { // 불변성
  const replaced = (array);

  for (let i = 0; i < replaced.length; i++) {
    if (replaced[i] === from) {
      replaced[i] = to;
    }
  }

  return replaced;
}

const array = ['🍌', '🍓', '🍇', '🍓'];
const result = replace(array, '🍓', '🥝');
console.log(array);

// // [TO-BE] 함수형 프로그래밍 버전

function replace(array, from, to) {
  return map(array, (item) => (item === from ? to : item)); // 고차함수 map 사용
  for (let i = 0; i < array.length; i++) {
    if(array[i] === from) {
      array[i] = to;
    } else {
      array[i] = array[i];
    }
  }
}
const array = ['🍌', '🍓', '🍇', '🍓'];
const result = replace(array, '🍓', '🥝');



// ### 그렇다면 고차함수로 순수함수를 만들어나가는 과정이 함수형 프로그래밍인가요?


let count = 0;
function increment() {
  count ++;
  return count
} //상태가 바뀜
console.log //화면에 뭐가뜸
fetch("https://........") // http 요청이감

function add(x:number, y:number): number {

  return fetch("api.plus.com", {x,y})
}

add(10, 20) === 30


// 똑같은 프로그램을 만드든데 부수효과를 줄일수있으면 그게 더좋다
// 그래서 순수함수(=부수효과 0)인 함수들이 많은 코드일수록 그 조건을 더만족시킬테니 또 좋다
// 근데 언제나 부수효과0인 프로그램을 짤순없다
// 이때는 부수효과를 제한하면서 더 예측가능한 방식으로 짤수있어야한다