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
    
  for (let i = 1; i < numLog.length; i++) {
    let diff = numLog[i] - numLog[i - 1];
    text += commands[diff.toString()]; 
    // 여기왔을때 i번째 까지 처리완료
    // i + 1 번째까지 라기보단, 간결하게 i 까지로 기준을 잡는 것이 더 좋음.
  }
  return text;
}

// test
console.log(solution2([0, 1, 0, 10, 0, 1, 0, 10, 0, -1, -2, -1]));


