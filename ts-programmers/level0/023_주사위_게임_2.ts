`https://school.programmers.co.kr/learn/courses/30/lessons/181930`

function solution(a: any, b: any, c: any) {
  let allSame = a === b && a === c && b === c;
  let twoSame = a === b || a === c || b == c;
  let result = 0;

  if (twoSame) {
    result = (a + b + c) * (a**2 + b**2 + c**2); // 조건 중 공통되는 부분을 먼저 처리
      if(allSame) {
          result *= (a**3 + b**3 + c**3)
      }
  } else {
    result = a + b + c;
  }

  return result
}

console.info(solution(2, 6, 1)); // 9
console.info(solution(5, 3, 3)); // 473
console.info(solution(4, 4, 4)); // 110592