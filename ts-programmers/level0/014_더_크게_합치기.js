// https://school.programmers.co.kr/learn/courses/30/lessons/181939

function solution(a, b) {
  a = a.toString();
  b = b.toString();

  var answer = 0;
  let res1 = a + b;
  let res2 = b + a;

  if (res1 > res2 || res1 == res2) {
    answer = Number(res1);
  } else {
    answer = Number(res2);
  }

  return answer;
}
