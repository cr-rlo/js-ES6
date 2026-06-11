const products = [
{ name: '반팔티', price: 15000, quantity: 1 },
{ name: '긴팔티', price: 20000, quantity: 2 },
{ name: '핸드폰 케이스', price: 15000, quantity: 3 },
{ name: '후드티', price: 30000, quantity: 4 },
{ name: '바지', price: 25000, quantity: 5}
];

// 총 수량
go(
  products,
  map(p => p.quantity),
  reduce((a,b) => a+b),
  console.log(go)
);

// total quantity 함수로 표현하기 
const total_quantity = products => go(
  products,
  map(p => p.quantity),
  reduce(add)
);
console.log(total_quantity(products));

const total_quantity2 = pipe(
  map(p => p.quantity),
  reduce(add)
);
// go 함수와 밑 pipe함수를 사용한 것이 같은 결과를 도출하는 이유는?
// pipe 함수는 내부적으로 go 함수를 리턴하도록 설계되어 있음
// go 함수는 데이터를 지금 바로 받아서 즉시 결과를 짜내는 함수, pipe 함수는 함수들을 미리 한 줄로 엮어서 나중에 데이터가 들어오면 실행할 전용 파이프라인(함수)를 리턴하는 함수
// total_quantity 함수는 products를 입력받으면, 그 자리에서 즉시 go를 실행해 products를 map과 reduce에 통과시킴
// 컴퓨터가 pipe를 실행하고 total_quantity에 저장한 진짜 모습은 const total_quantity = (x) => go(x,map(p => p.quantity),reduce((a,b) => a+b));
// 인자 하나(x)를 받아서 go의 첫 번째 인자로 밀어 넣음
// 완성된 total_quantity를 사용할 때 products 데이터를 주면서 호출하면 아까 만들어둔 알맹이 코드의 x 자리에 products를 대입해서 실행함 




// 총 가격
const total_price = pipe(
  map(p => p.price * p.quantity),
  reduce(add)
);
console.log(total_price);

// 중복 코드 묶기
// 위에 reduce(add)부분이 같으므로 묶어서 처리
const add = (a,b) => a+b;

// 더 나아가서 총 수량과 총 가격을 보면 map부분을 빼고 완전히 비슷한 코드이기에 추상화 레벨을 더 높여 더 많은 곳에서 사용되게 할 수 있음
const sum = (f, iter) => go(
  iter,
  map(f),
  reduce(add)
);
  // 이 함수는 함수와 iterator을 받아서 go를 하면서 비슷한 일을 함
  // 위 함수를 호출하면서 상황에 맞는 인자를 넣어주면 다양한 상황에서 사용가능
console.log(sum(p => p.quantity, products));
console.log(sum(p => p.quantity * p.price, products));

// const total_quantity = products => sum(p => p.quantity , products); 이렇게 간단화 가능


// 마지막으로 curry로 더 단순화 가능
const sum = curry((f, iter) => go(
  iter,
  map(f),
  reduce(add)
));
const total_quantity = sum(p => p.quantity);
sum();


