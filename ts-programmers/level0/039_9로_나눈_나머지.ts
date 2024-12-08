// https://school.programmers.co.kr/learn/courses/30/lessons/181914

// 첫번째 풀이
function solution(number: string):number {
  var answer = 0;

  for(const i of number) {
    answer += Number(i);
}

return answer % 9;
}

// 두번째 풀이
// 1. map / reduce 로 함수형 프로그래밍 처럼
// number은 스트링으로 이터러블 하기 때문에 split 이 필요 없지 않을까 했지만,, ts 에서는 명시적인게 중요하다고 함
function solution2(number: string):number {
  return number // [...number] split 대신 사용할 수 있지만, 명시적으로 split 으로 만들어 주는게 더 좋다고함 
    .split('').map(Number).reduce((acc, cur) => acc + cur, 0) % 9; 
}

// test
solution("123"); // 6
solution2("123"); // 6