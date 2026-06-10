const products = [
{ name: '반팔티', price: 15000 },
{ name: '긴팔티', price: 20000 },
{ name: '핸드폰 케이스', price: 15000},
{ name: '후드티', price: 30000},
{ name: '바지', price: 25000}
];
// 상품이 담긴 배열
// key와 value만 각각 모아서 출력하고자 하거나 따로 배열에 담는 등의 로직이 필요할 때가 있음

// 상품명만 따로 수집한 배열
let names = [];
for (const p of products){
  names.push(p.name);
}
console.log(names);
// 가격만 따로 수집한 배열
let prices = [];
for (const p of products){
  prices.push(p.price);
}
console.log(prices);
// 위와 같은 코드들을 작성할 때 사용하는 것이 map 함수

// map 함수
const map = (f, iter) => {
  let res = [];
for (const a of iter){
  res.push(f(a));
}
return res;
};
// map 함수가 받는 값이 이터레이블 프로토콜을 따름
// map 함수는 매개변수로 함수를 받아서 어떤 값을 수집할 것인지를 함수에 완전히 위임

map(p => p.name, products);
// f는 p를 받아서 프로덕트의 네임을 수집하는 함수 전달
// iter로 products를 전달
console.log(map(p => p.name, products));
console.log(map(p => p.price, products));
// 로그를 찍어보면 결과가 잘 도출되었음을 확인

function *gen(){
  yield 2;
  yield 3;
  yield 4;
}
console.log(map(a => a * a, gen()));

// map 객체
let m = new Map();
// map 객체 선언
m.set('a', 10);
m.set('b', 20)
const it = m[Symbol.iterator]();
// map은 이터러블이기 때문에 심볼 이터레이터를 했을 때 특정 이터레이터 반환
it.next();
// next를 했을 때 값이 조회됨
// 이는 map 함수의 iterable 값으로 사용할 수 있다는 의미
map(([k, a]) =>[k, a*2], m);
// 그리고 보조함수를 전달했을 때 value가 array로 들어오기 때문에 구조 분해를 해서 키와 값을 나눠 받을 수 있음 
// 이것을 가지고 키와 값을 보조함수에서 이 map에 맞춰서 똑같이 엔트리를 반환하도록 해주면 엔트리로 반환
// 그럼 이 반환값으로 다시 맵 객체를 만들 수 있음
new Map(map(([k, a]) =>[k, a*2], m));

// 특정 데이터를 걸러내는 방법
let under20000 = [];
for (const p of products){
  if(p.price < 20000) under20000.push(p)
};
console.log(under20000);
console.log(...under20000);
// 전개 연산자를 사용하면 더 편하게 결과 조회 가능

// 위 코드를 filter로 리팩토링
const filter = (f, iter) => {
  let res = [];
for (const a of iter){
  if(f(a)) res.push(a)
 }
return res;
};
// 어떤 값이든 받을 수 있도록 이터러블 프로토콜을 따르도록 함
// 어떤 조건일 때 filter을 할 것인가를 함수를 이용해서 작성 -> 보조 함수에 완전히 위임
filter(p => p.price < 20000, products);
// 내부에 있는 값에 대한 다형성은 보조 함수를 통핵서 지원
// 외부의 경우는 이터러블 프로토콜을 따르는 것을 통해서 다형성을 지원
// 이 filter역시도 다양한 것들을 걸러낼 수 있게 됨

// reduce
const nums = [1,2,3,4,5];
// 위 값들을 다 더해서 하나의 값으로 만들고자 하는 경우
let total = 0;
for(const n of nums){
  total = total + n;

}
console.log(total);

// reduce 함수
const reduce = (f, acc, iter) => {
  for (const a of iter){
    acc = f(acc, a)
    // 더하는 연산 자체를 보조함수에게 위임해서 계속 누적하고 있는 값과 이번에 사용해야 되는 값을 줌
  }
  return acc;

};
const add = (a, b) => a+b;
console.log(reduce(add, 0, [1,2,3,4,5]));
// 매개변수로 add함수, 초깃값 0, 배열
// 연속적으로 재귀적으로 받은 add함수를 실행하면서 하나의 값으로 누적을 해나감

// 시작하는 값을 생략했을 경우에 내부적으로 reduce가 배열의 맨 첫 번째 값으로  값을 받은 것처럼 변경함
const reduce2 = (f, acc, iter) => {
  if (!iter){
    iter = acc[Symbol.iterator]();
    // iter값이 없는 경우 acc에 심볼 이터레이터를 실행해서 이터러블 값을 이터레이터로 변환
    acc = iter.next().value;
    // acc 값은 이 이터레이터 안에 있는 첫 번째 값으로 해줘야하니 next를 해서 value를 넣어줌
  }
  for(const a of iter){
    acc = f(acc, a);
  }
    return acc;
};
console.log(reduce2(add, [1,2,3,4,5]));

// reduce는 보조함수를 통해서 어떻게 축약할지를 완전히 위임하는 것이기 때문에 단순한 배열 외에도 좀 더 복잡한 형태의 데이터 역시 축약 가능
// 위에서 만들어 둔 products의 가격을 모두 더하는 코드를 reduce만으로 작성하는 법
const reduce3 = (f, acc, iter) => {
  for (const a of iter){
    acc = f(acc, a)
    // 더하는 연산 자체를 보조함수에게 위임해서 계속 누적하고 있는 값과 이번에 사용해야 되는 값을 줌
  }
  return acc;

};
console.log(reduce3((total_price, product) => total_price + product.price, 0, products));

// map + filter + reduce 중첩사용
const add2 = (a, b) => a+b;

reduce2
  (add2,
    map(p => p.price, 
      filter(p => p.price < 20000, products)));
      // products를 20000원 미만으로 filter
      // 해당하는 값의 price들만 map을 통해 뽑아냄
      // 해당하는 모든 값을 reduce add를 통해서 축약

reduce2
  (add2,
    filter(n => n < 20000,
      map(p => p.price), products));
      // map을 통해 products의 price 값만 뽑아냄
      // 가격이 20000원 미만인 것을 filter
      // 해당하는 모든 값을 reduce add를 통해서 축약


reduce(
  add,
  [10, 20, 30, 40]
  // 이 배열 자리에 숫자가 들어있는 배열로 평가되도록 코드를 작성하면 됨
  // 그래서 map을 통해서 이 자리에 숫자들이 들어있는 배열을 평가시키겠다. 라는 코드를 작성해서 함수를 작성할 수 있음
  // map(p => p.price, products);
  // products의 자리 역시 filter을 사용해 특정 조건의 상품만 남겨둔 코드를 작성해야겠다 라고 작성할 수 있음
  // map(p => p.price, filter(p => p.price < 20000, products));
);
    
