// https://school.programmers.co.kr/learn/courses/30/lessons/181922

function solution(l: number, r: number) {
  let result = [];
  for(let i = l; i <= r; i++) {
    const isValid = i.toString().split('').every((item) => item === '0' || item === '5');
    if(isValid) {
      result.push(i);
    }
  }
  return result.length === 0 ? [-1] : result; // result.push(-1)는 배열의 길이를 반환함. 따라서 조건문에서 result.push(-1)를 반환하면 result 배열이 아닌 배열의 새로운 길이가 반환됨.
}

// every vs filter vs some
// filter는 조건을 만족하는 요소를 추출해 새 배열을 반환.
// 반면, every는 조건을 만족하는지 여부만 반환.
// some은 배열의 하나라도 조건을 만족하면 true를 반환.
// 반대로, every는 모든 요소가 조건을 만족해야 true.

// test
let l = 5;
let r = 555;

let l2 = 10;
let r2 = 20;

console.info(solution(l, r)); // [ 5,  50,  55, 500, 505, 550, 555 ]
console.info(solution(l2, r2)); // [ -1 ]