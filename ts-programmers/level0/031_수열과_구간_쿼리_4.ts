// https://school.programmers.co.kr/learn/courses/30/lessons/181922

function solution(arr: number[], queries: [number, number, number][]): number[] {
  queries.forEach(([s, e, k]) => {
      for(let i = s; i <= e; i++) {
          if(i % k === 0) {
              arr[i] += 1;
          }
      } 
  })
  return arr;
}

// test
const arr = [0, 1, 2, 4, 3];
const queries = [[0, 4, 1],[0, 3, 2],[0, 3, 3]];

console.info(solution(arr, queries)); // [ 3, 2, 4, 6, 4 ]