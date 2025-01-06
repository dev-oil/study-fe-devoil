// https://school.programmers.co.kr/learn/courses/30/lessons/181919

function solution(n: number, arr: number[] = []): number[] {
  // push -> 배열 자체를 수정하기 때문에 ... 부작용 위험!

  if (n === 1) {
    return [...arr, n]; // ... 로 새로운 배열 리턴
  }

  if (n % 2 === 0) {
    return solution(n / 2, [...arr, n]); 
  }

  return solution(3 * n + 1, [...arr, n]);
}

// test
console.log(solution(10)); // [ 10, 5, 16, 8, 4, 2,  1 ]

