// https://school.programmers.co.kr/learn/courses/30/lessons/181931

function solution(a, d, included) {
  let answer = 0;
  let number = a;

  for (let i = 0; i < included.length; i++) {
    if (included[i] === true) {
      answer += number;
    }
    number += +d;
  }
  return answer;
}
