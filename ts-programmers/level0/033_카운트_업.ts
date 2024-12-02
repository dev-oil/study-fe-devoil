// https://school.programmers.co.kr/learn/courses/30/lessons/181920

// 첫번째 풀이
function solution(start_num:number, end_num:number) {
  let result = [];

  for (let i = start_num; i <= end_num; i++) {
    result.push(i);
  }
  
  return result;
}

// 새 배열 생성 + 초기화: Array.from 사용
// 기존 배열 변환: map 사용

// 두번째 풀이
function solution2(start_num:number, end_num:number) {
  return Array.from({length: end_num - (start_num - 1) }, (_, i) => start_num + i);
}

// test
console.info(solution2(3, 10));
