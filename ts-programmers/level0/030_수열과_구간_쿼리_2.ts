// https://school.programmers.co.kr/learn/courses/30/lessons/181924

// 첫번째 풀이
function solution(arr: number[], queries: [number, number, number][]): number[] {
  let result: number[] = []; // 결과 배열 타입 지정

  for (const [idx1, idx2, idx3] of queries) {
      // 부분 배열 추출
      let firstArr: number[] = arr.slice(idx1, idx2 + 1);
      let secondArr: number[] = [];

      // 조건에 맞는 값 필터링
      for (const i of firstArr) {
          if (i > idx3) {
              secondArr.push(i);
          }
      }

      // 최소값 찾기 또는 -1 추가
      if (secondArr.length > 0) {
          result.push(Math.min(...secondArr));
      } else {
          result.push(-1);
      }
  }

  return result; // 결과 반환
}

// 두번째 풀이
// 1. for문 대체할 수 있는 함수로 변경
// 2. if문 삼항연산자 변경
function solution2(arr: number[], queries: [number, number, number][]): number[] {
  return queries.map(([idx1, idx2, idx3]) => {
    const result: number[] = arr.slice(idx1, idx2 + 1).filter(num => num > idx3);
    return result.length > 0 ? Math.min(...result) : -1;
  });
}


// test
let arr = [0, 1, 2, 3, 4];
let queries = [[0, 4, 2],[0, 3, 2],[0, 2, 2]];

console.log(solution2(arr, queries)); // [3, 4, -1]