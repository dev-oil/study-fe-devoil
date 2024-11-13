// https://school.programmers.co.kr/learn/courses/30/lessons/181947

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on('line', function (line) {
  input = line.split(' ');
}).on('close', function () {
  let n1 = Number(input[0]);
  let n2 = Number(input[1]);

  console.log(`${n1} + ${n2} = ${n1 + n2}`);
});
