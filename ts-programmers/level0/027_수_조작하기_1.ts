// https://school.programmers.co.kr/learn/courses/30/lessons/181926

// 첫번째 풀이
function solution(n: number, control: string) {
  for (let i of control) {
    if (i === 'w') {
      n +=1;
    } else if (i === 's'){
      n -= 1;
    } else if (i === 'd'){
      n += 10;
    } else {
      n -= 10;
    }
  }
  return n;
}

// 두번째 풀이 (객체 사용)
function solution2(n:number, control: string) {
  const commands: { [key: string]: number } = {
    w: 1,
    s: -1,
    d: 10,
    a: -10
  };

  for (const i of control) {
    n += commands[i];
  }

  return n;
}

console.log(solution2(0, 'wsdawsdassw')); // -1
