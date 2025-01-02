// https://school.programmers.co.kr/learn/courses/30/lessons/181919

function solution(n: number, arr: number[] = []): number[] {
  arr.push(n);

  if (n === 1) {
    return arr; 
  }

  if (n % 2 === 0) {
    return solution(n / 2, arr); 
  }

  return solution(3 * n + 1, arr);
}

// test
console.log(solution(10)); // [ 10, 5, 16, 8, 4, 2,  1 ]

