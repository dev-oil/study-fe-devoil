// https://school.programmers.co.kr/learn/courses/30/lessons/181944

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on('line', function (line) {
  input = line.split(' ');
}).on('close', function () {
  n = Number(input[0]);

  if (n % 2 === 0) {
    console.log(`${n} is even`);
  } else {
    console.log(`${n} is odd`);
  }
});

// 이렇게 풀기도 하네요
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// }).on('line', function (line) {
//     const result = Number(line) % 2 ? 'odd' : 'even'
//     console.log(line, 'is', result)
// })
