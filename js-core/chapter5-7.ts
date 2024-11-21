// < 5 > 클로저 //
// 예제 5-5. 클로저의 메모리 관리
// (1) return에 의한 클로저의 메모리 해제
// let outer = (function () {
//   let a = 1;
//   let inner = function () {
//     return ++a;
//   }
//   return inner;
// })();

// console.log(outer()); // 2
// console.log(outer()); // 3
// outer = null; // outer 식별자의 inner 함수 참조를 끊음

// 자동차 경주 게임
/**
 * 1. 각 턴마다 주사위를 굴려 나온 숫자(Km)만큼 이동한다.
 * 2. 차량별로 연료량(fuel)과 연비(power)는 무작위로 생성된다.
 * 3. 남은 연료가 이동할 거리에 필요한 연료보다 부족하면 이동하지 못한다.
 * 4. 모든 유저가 이동할 수 없는 턴에 게임이 종료된다.
 * 5. 게임 종료 시점에 가장 멀리 이동해 있는 사람이 승리!
 */

// 예제 5-10 자동차 경주 게임
// let car = {
//   fuel: Math.ceil(Math.random() * 10 + 10), // 연료(L) // Math.ceil > 소수점 이하를 올림
//   power: Math.ceil(Math.random() * 3 + 2), // 연비(km/L)
//   moved: 0, // 총 이동거리
//   run: () => {
//     let km = Math.ceil(Math.random() * 6);
//     let wasteFuel = km / this.power;
//     if(this.fuel < wasteFuel) {
//       console.log('이동 불가합니다!');
//       return;
//     }
//     this.fuel -= wasteFuel;
//     this.moved += km;
//     console.log(km + 'km 이동 (총' + this.moved + 'km');
//   }
// }

// 예제 5-11 클로저로 변수를 보호한 자동차 객체(1)
// let createCar = () => {
//   let fuel = Math.ceil(Math.random() * 10 + 10); // 연료(L) // Math.ceil > 소수점 이하를 올림
//   let power = Math.ceil(Math.random() * 3 + 2); // 연비(km/L)
//   let moved = 0; // 총 이동거리

//   return {
//     get moved () {
//       return moved;
//     },
//     run: () => {
//       let km = Math.ceil(Math.random() * 6);
//       let wasteFuel = km / power;
//       if (fuel < wasteFuel) {
//         console.log('이동 불가!');
//         return;
//       }
//       fuel -= wasteFuel;
//       moved += km;
//       console.log(km + 'km 이동 (총' + moved + 'km). 남은 연료:' + fuel);
      
//     }
//   }
// }

// let car = createCar();

// car.run(); 
// console.log(car.moved);
// console.log(car.fuel);
// console.log(car.power);

// car.fuel = 1000;
// console.log(car.fuel); // 1000
// car.run();

// car.power = 100;
// console.log(car.power); // 100
// car.run();

// car.moved = 1000;
// console.log(car.moved); // 8
// car.run();

// 어뷰징까지 막기 위해선 publicMembers 객체 생성 후 Object.freeze(publicMembers). 후 return publicMembers

// < 6 > 프로토타입 //
// 예제 6-1. Person.prototype
let Person = function (name) {
  this._name = name;
};
Person.prototype.getName = function () {
  return this._name;
}

// let suzi = new Person('Suzi');
// console.log(suzi.__proto__.getName()) // undefined

// console.log(Person.prototype === suzi.__proto__); // true


// < 6 > 클래스 //
let Rectangle = class {
  constructor (width, height) {
    this.width = width;
    this.height = height;
  }
  getArea () {
    return this.width * this.height;
  }
}

var Square = class extends Rectangle {
  constructor (width) {
    super(width, width) {

    }
  }
  getArea () {
    console.log('size is: ', super.getArea());
  }
}