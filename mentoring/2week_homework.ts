/*****************************************/
// 숙제 1
// https://school.programmers.co.kr/learn/courses/30/lessons/181932
// 상단 '코드 처리하기'의 솔루션을 수정해주세요.

// [AS-IS]
function solution0(code) {
  let ret = '';
  let mode = 0;

  for (let i = 0; i < code.length; i++) {
    if (mode === 0) {
      code[i] === '1' ? (mode = 1) : i % 2 === 0 && (ret += code[i]);
    } else {
      code[i] === '1' ? (mode = 0) : i % 2 !== 0 && (ret += code[i]);
    }
  }
  return ret.length > 0 ? ret : 'EMPTY';
}

// [TO-BE 1]
// 1. ts 변환 (type 추가했습니다)
// 2. if 문을 쓰되, mode 부분과 변경 부분을 달리하여 가독성 있게 수정해 보았습니다.
// 3. 삼항연산자는 간결한 부분에만 사용하였습니다.
function solution(code: string): string {
  let ret: string = '';
  let mode: '0' | '1' = '0';
  
  for (const [i, char] of [...code].entries()) { // entries 사용 시 배열 또는 타입이 명시된 이터러블 객체에서만 사용 가능 (Iterable로 인식할 수 있도록 타입 단언 [...code]를 사용)
    if (char === '1') {
      mode = mode === '0' ? '1' : '0';
    } else if (i % 2 === +mode) { // mode가 0이면 짝수, mode가 1이면 홀수 // + 단항 덧셈 연산자 이용
      ret += char;
    }
  }
  
  return ret.length > 0 ? ret : "EMPTY";
}

console.info(solution('abc1abc1abc'));

// [TO-BE 2]
// 다른 사람 풀이
function solution2(code) {
    let answer = '';
    let mode = 0;

    for (let i = 0; i < code.length; i += 1) {
      if (Number(code[i]) === 1) {
        mode = mode === 1 ? 0 : 1;
      }
      if (Number(code[i]) !== 1 && i % 2 === mode) { // 모드를 이용해서 짝수 홀수 값을 맞춤
        answer += code[i];
      }
    }
    return answer.length > 0 ? answer : 'EMPTY';
}
console.info(solution2('abc1abc1abc'));

/*****************************************/
// 숙제 2
// map 함수를 구현해보세요.
const arr = [1, 2, 10, 5];

// [원래의 map]
// arr.map(function (currentValue, index, array) {});

// [만들어본 map]
// currentValue
function mapForMe(xs: any[], f: (x: any) => any): any[] {
  let result: any[] = [];
  
  for (let i = 0; i < xs.length; i++) {
    result.push(f(xs[i]));  // 함수 f(x)에 배열 요소 전달
  }
  
  return result; // 배열 반환
}

// [사용]
const resultMap = mapForMe(arr, (x) => x)
console.info(resultMap);

/*****************************************/
// 숙제 3
// setTimeout으로 setInterval을 만들어보세요.
// [원래의 setInterval]
// setInterval(function, interval);

// [만들어본 setInterval]
function setIntervalForMe(f: any, time: number){
  function repeat() {
    f();  // 주어진 함수 실행
    setTimeout(repeat, time);
  }
  setTimeout(repeat, time);  // 처음 호출
}

// [사용]
const resultSetInterval = setIntervalForMe(() => {
  console.info('자... 이게 클릭이야..');
}, 1000)
