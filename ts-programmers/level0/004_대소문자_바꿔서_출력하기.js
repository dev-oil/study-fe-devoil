// https://school.programmers.co.kr/learn/courses/30/lessons/181949

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on('line', function (line) {
  input = [line];
}).on('close', function () {
  str = input[0];

  let result = '';
  let strSplit = str.split('');

  for (let i of strSplit) {
    if (i === i.toUpperCase()) {
      i = i.toLowerCase();
    } else {
      i = i.toUpperCase();
    }
    result += i;
  }

  console.log(result);
});
