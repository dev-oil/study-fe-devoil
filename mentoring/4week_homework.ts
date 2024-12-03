// 4주차 숙제
// 숙제 1
// Array.filter 구현하기
function filterForMe(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }

  return result;
}

// Array.prototype.filterForMe = function(callback) {
//   const result = [];
  
//   for (let i = 0; i < this.length; i++) {
//     if (callback(this[i], i, this)) {
//       result.push(this[i]);
//     }
//   }
  
//   return result;
// };

// test
const numbers = [1, 2, 3, 4, 5];
const result = filterForMe(numbers, num => num > 2);
console.log(result);  // [3, 4, 5]

// 숙제 2
// Array.flatMap 구현하기
function flatMapForMe(arr, callback) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const mappedValue = callback(arr[i], i, arr);
    for (let j = 0; j < mappedValue.length; j++) {
      result.push(mappedValue[j]);
    }
  }
  
  return result;
}

// Array.prototype.flatMapForMe = function(callback) {
//   const result = [];
  
//   for (let i = 0; i < this.length; i++) {
//     const mappedValue = callback(this[i], i, this);
//     for (let j = 0; j < mappedValue.length; j++) {
//       result.push(mappedValue[j]);
//     }
//   }
  
//   return result;
// };

const sentences = ["Hello world", "How are you"];
const words = flatMapForMe(sentences, sentence => sentence.split(" "));
console.log(words); // [ 'Hello', 'world', 'How', 'are', 'you' ]