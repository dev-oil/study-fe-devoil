// https://school.programmers.co.kr/learn/courses/30/lessons/181925

// 첫번째 풀이
function solution(numLog: number[]) {
  let text = "";
    
  for(let i = 0; i < numLog.length - 1; i++) {
    let diff = numLog[i + 1] - numLog[i];
      
    if(diff === 1) {
      text += "w";
    } else if (diff === -1) {
      text += "s";
    } else if (diff === 10){
      text += "d";
    } else if (diff === -10) {
      text += "a";
    }
  }
  return text;
}

// 두번째 풀이
function solution2(numLog: number[]) {
  let text = "";
  const commands : { [key: string]: string } = { "1": "w", "-1": "s", "10": "d", "-10": "a" };
    
  for (let i = 0; i < numLog.length - 1; i++) {
    let diff = numLog[i + 1] - numLog[i];
    text += commands[diff.toString()]; 
  }
  return text;
}

// test
console.log(solution2([0, 1, 0, 10, 0, 1, 0, 10, 0, -1, -2, -1]));


