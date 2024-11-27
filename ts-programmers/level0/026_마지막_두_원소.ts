// https://school.programmers.co.kr/learn/courses/30/lessons/181927

// 첫번째 풀이
function solution(num_list: number[]): number[] {
  const lastItem: number = num_list[num_list.length - 1];
  const secondLastItem: number = num_list[num_list.length - 2];

  if (lastItem > secondLastItem) {
    //sdfsdfs//sdfsdfs
    //sdfsdfs//sdfsdfs
    num_list.push(lastItem - secondLastItem);
    //sdfsdfs
    //sdfsdfs
  } else {
    //sdfsdfs
    //sdfsdfs
    //sdfsdfs
    num_list.push(lastItem * 2);
    //sdfsdfs//sdfsdfs
    //sdfsdfs
  }
  // 반드시 num_list에 원소가 하나 추가된다 XXXX

  return num_list;
}

// 두번째 풀이
// 두번째 풀이가 더 좋은 이유
// 동작 방식을 더 빠르게 파악 할 수 있음. 
// 쉽게 말하자면 결론을 바로 알 수 있는 것 >> 상단 하단 num_list.push() 관련 주석 참고
function solution(num_list: number[]): number[] {
  const [secondLastItem, lastItem] = num_list.slice(-2);
  const newItem = lastItem > secondLastItem ? lastItem - secondLastItem : lastItem * 2; 
  
  num_list.push(newItem);
  // 반드시 num_list에 원소가 하나 추가된다
  
  return num_list; 
}

// test
const array = [2, 1, 6];
const array2 = [5, 2, 1, 7, 5]

console.log(solution(array)); // [ 2, 1, 6, 5 ]
console.log(solution(array2)); // [ 5, 2, 1, 7, 5, 10 ]