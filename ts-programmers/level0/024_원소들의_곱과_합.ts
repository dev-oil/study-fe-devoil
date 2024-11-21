`https://school.programmers.co.kr/learn/courses/30/lessons/181929`;

function solution(num_list: string | any[]) {
  let add = 0;
  let multiply = 1;
  
  for(let i of num_list){ // of 문으로 변경
    add += i;
    multiply *= i;
  }
  
  add = add**2;
  
  if(multiply < add){
    return 1;
  } 
  return 0;
}

console.info(solution([3, 4, 5, 2, 1])); // 1
console.info(solution([5, 7, 8, 3])); // 0