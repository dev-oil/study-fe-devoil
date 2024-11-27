// https://school.programmers.co.kr/learn/courses/30/lessons/181928

function solution(num_list: number[]) : number {
  let odd = "";
  let even = "";
  
  for(const i of num_list) {
      if(i % 2 === 0) {
        even += i;
      } else {
        odd += i;
      }
  }
  return Number(even) + Number(odd);
}

// test
const array = [3, 4, 5, 2, 1];
const array2 = [5, 7, 8, 3];

console.log(solution(array)); // 393
console.log(solution(array2)); // 581

