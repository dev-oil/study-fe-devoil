// 3주차 숙제
// [class version]
`class Dog {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sleep() {
    console.info("sleep")
  }
}

class Poodle extends Dog{
  constructor(name, age, color) {
    super(name, age)
    this.color = color;
  }
  
  swim() {
    console.info("swim")
  }
}

const happy = new Poodle();

console.log(happy);
happy.swim();`

// [prototype version]
function Dog(name, age) {
  this.name = name;
  this.age = age;
}

function Poodle(name, age, color) {
  Dog.call(this, name, age); // call로 상속 > class super(name, string)
  this.color = color;
}

Poodle.prototype = Object.create(Dog.prototype); // Poodle의 프로토타입을 Dog에 연결. 상속해줌

// swim 만들어주기
Poodle.prototype.swim = () => {
  console.info('swim 🏊‍♂️');
};

const happy = new Poodle();

console.log(happy)
happy.swim();

// 상속도 확인하는 법 (instanceof)
console.log(happy instanceof Poodle); // true
console.log(happy instanceof Dog); // true

