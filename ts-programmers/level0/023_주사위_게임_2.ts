`https://school.programmers.co.kr/learn/courses/30/lessons/181930`

function solution(a: any, b: any, c: any) {
  let allSame = a === b && a === c && b === c;
  let allDifferent = a !== b && a !== c && b !== c;
    
  if (allSame) {
    return (a + b + c) * (a**2 + b**2 + c**2) * (a**3 + b**3 + c**3);
  } else if (allDifferent) {
    return a + b + c;
  } else {
    return (a + b + c) * (a**2 + b**2 + c**2);
  }
}

console.info(solution(2, 6, 1)); // 9
console.info(solution(5, 3, 3)); // 473
console.info(solution(4, 4, 4)); // 110592