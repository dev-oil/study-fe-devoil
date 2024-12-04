// 4주차 숙제
// 숙제 1
// Array.filter 구현하기
function filterForMe(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }

  return result;
}

// Array.prototype.filterForMe = function(callback) {
//   const result = [];
  
//   for (let i = 0; i < this.length; i++) {
//     if (callback(this[i], i, this)) {
//       result.push(this[i]);
//     }
//   }
  
//   return result;
// };

// test
const numbers = [1, 2, 3, 4, 5];
const result = filterForMe(numbers, num => num > 2);
console.log(result);  // [3, 4, 5]

// 숙제 2
// Array.flatMap 구현하기
function flatMapForMe(arr, callback) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const mappedValue = callback(arr[i], i, arr);
    for (let j = 0; j < mappedValue.length; j++) {
      result.push(mappedValue[j]);
    }
  }
  
  return result;
}

// Array.prototype.flatMapForMe = function(callback) {
//   const result = [];
  
//   for (let i = 0; i < this.length; i++) {
//     const mappedValue = callback(this[i], i, this);
//     for (let j = 0; j < mappedValue.length; j++) {
//       result.push(mappedValue[j]);
//     }
//   }
  
//   return result;
// };

const sentences = ["Hello world", "How are you"];
const words = flatMapForMe(sentences, sentence => sentence.split(" "));
console.log(words); // [ 'Hello', 'world', 'How', 'are', 'you' ]

// 5주차 수업 내역

function filterForMe<T>(arr: T[], callback: (x: T, index: number, arr: T[]) => boolean): T[] {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }

  return result;
}

// falsy. 0 "" null
const ys = ["1","2","3","4","5"]
const xs = filterForMe<string>(ys, (x) => x * 2 < 3)

// [ 'a', 'b', 'c' ]
// filterForMe<number, unknown>(arr: number, callback: any): any[]

export {}


function mapForMe<T, U>(xs: T[], f: (x: T) => U): U[] {
  let result: U[] = [];
  
  for (let i = 0; i < xs.length; i++) {
    result.push(f(xs[i]));  // 함수 f(x)에 배열 요소 전달
  }
  
  return result; // 배열 반환
}

const xs2 = mapForMe([1,2,3], (x) => x.toString() + "1")


function solution(arr: number[], queries: [number,number,number][]): number[] {
  queries.forEach(([s, e, k]) => {
      for(let i = s; i <= e; i++) {
          if(i % k === 0) {
              arr[i] += 1;
          }
      } 
  })
  return arr;
}