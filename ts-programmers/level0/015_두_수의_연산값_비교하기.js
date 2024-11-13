// https://school.programmers.co.kr/learn/courses/30/lessons/181938

function solution(a, b) {
  return Math.max(Number(`${a}${b}`), Number(`${2 * a * b}`));
}
