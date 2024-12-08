// https://school.programmers.co.kr/learn/courses/30/lessons/181913

function solution(my_string: string, queries: number[]): string {
  let myArr: string[] = my_string.split('');

  for (const [s, e] of queries) {
    const subArr: string[] = myArr.slice(s, e + 1).reverse();

    for (let i = s; i <= e; i++) {
      myArr[i] = subArr[i - s];
    }
  }

  return myArr.join('');
}

console.log(solution('rermgorpsam', [[2, 3], [0, 7], [5, 9], [6, 10]])); // programmers