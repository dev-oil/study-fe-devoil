// https://school.programmers.co.kr/learn/courses/30/lessons/181916

function solution(a: number, b: number, c: number, d: number): number {
  const dice: number[] = [a, b, c, d].sort((x, y) => x - y);
  const [p, q, r, s] = dice;

  // 1. 네 주사위가 모두 같은 경우
  if (p === s) return 1111 * p;

  // 2. 세 주사위가 같고 하나가 다른 경우
  if (p === r || q === s) {
    const same: number = p === r ? p : s; // 세 개의 동일한 숫자
    const different: number = p === r ? s : p; // 나머지 다른 숫자
    return (10 * same + different) ** 2;
  }

  // 3. 두 쌍의 숫자가 각각 같은 경우
  if (p === q && r === s) {
    return (p + r) * Math.abs(p - r);
  }

  // 4. 두 개가 같고 나머지 두 개가 서로 다른 경우
  if (p === q || r === s) {
    const same: number = p === q ? p : r; // 같은 숫자
    const other1: number = p === q ? r : p; // 나머지 다른 숫자 1
    const other2: number = p === q ? s : q; // 나머지 다른 숫자 2
    return other1 * other2;
  }

  // 5. 네 숫자가 모두 다른 경우
  return p; // 정렬했으므로 가장 작은 숫자는 항상 첫 번째
}

// test
console.log(solution(2,2,2,2)); // 2222
console.log(solution(4,1,4,4)); // 1681
console.log(solution(6,4,2,5)); // 27

