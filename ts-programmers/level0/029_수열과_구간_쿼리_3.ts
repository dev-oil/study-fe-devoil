// https://school.programmers.co.kr/learn/courses/30/lessons/181924

// 첫번째 풀이
function solution(arr: number[], queries: [number, number][]): number[] {
  for (const [idx1, idx2] of queries) {
      const temp = arr[idx1];
      arr[idx1] = arr[idx2];
      arr[idx2] = temp;
  }
  return arr;
}

// 두번째 풀이
// 1. 함수형 프로그래밍 스타일로 forEach 사용
// 2. 구조분해 할당을 통해 더 간결하게 리팩토링
function solution2(arr: number[], queries: [number, number][]): number[] {
  queries.forEach(([idx1, idx2]) => {
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  });
  return arr;
}

// test
let arr = [0, 1, 2, 3, 4];
let queries = [[0, 3],[1, 2],[1, 4]];

console.log(solution2(arr, queries)); // [ 3, 4, 1, 0, 2 ]