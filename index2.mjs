console.log(
  reduce2
  (add2,
    map(p => p.price, 
      filter(p => p.price < 20000, products))));
// 위 코드를 읽기 편하게 변환해보자

// go 함수
const go = (...args) => {
  // 인자들을 통해서 하나의 값으로 축약해 나가자
  // 인자들이 들어왔다고 햇을 때 첫 번째 인자를 그 다음 인자인 함수에게 전달을 하고 그 함수의 결과를 또 다음 함수의 인자로 전달하는 식으로 연속적으로 하나의 일을 해야 함 -> 이 로직은 reduce라는 의미
  reduce((a, f) => f(a),args);



};

go([
  0,
  a => a+1,
  a => a+10,
  a => a+100,
  log
  ]
);

// pipe 함수
go(
  products,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price, products),
  prices => reduce(add, prices)
);

// go + curry
//const curry = f => 
  //(a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
  // curry라는 함수는 함수를 받아서 일단 함수를 리턴
  // 그리고 그 함수에서는 이제 처음 함수에서 사용 할 인자를 대신해서 받음
  // 이렇게 하면 첫 번째 인자와 그다음 나머지 인자들을 받게 됨
  // 만약에 이 함수에 인자가 두 개 이상 전달되었을 때라는 것을 뜻하는 것은 나머지 인자들에 length가 있을 때
  // length가 있다면 받아둔 함수를 즉시 실행하고 만약 아니라면 다시 한 번 함수 리턴 -> 그래서 그 이후에 들어올 값들을 받아보고 그때는 함수 실행 -> 미리 받은 a와 새로 받은 인자를 또 전달하는 것

  // 정리
  // 1. 일단 함수를 받아서 다시 함수를 리턴
  // 2. 그렇게 리턴된 함수가 실행되었을 때 인자가 만약에 2개 이상이라면 받아둔 함수를 즉시 실행
  // 3. 만약에 인자가 2개보다 작다면 함수를 다시 리턴한 후에 그 이후에 받은 인자들을 합쳐서 실행

  const mult = curry((a,b) => a*b);
  console.log(mult(1));
  // 이렇게 인자를 하나만 전달하면 결과는 역시 함수 -> :뒤에 나오는 함수
  console.log(mult(1)(2));
  // 여기서 실행을 한 번 더 하면서 이렇게 전달하면 제대로 결과가 나옴

  // 위에서 만들었던 go에 curry를 적용하면 더 쉽게 표현 가능
go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add)
);

const curry = f => 
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
const map = curry((f, iter) => {
  let res = [];
  for(const a of iter){
    res.push(f(a));
  }
  return res;
});

const filter = curry((f, iter) => {
  let res = [];
  for(const a of iter){
    if (f(a)) res.push(a);
  }
  return res;
});

const reduce = curry((f, acc, iter) => {
  if(!iter){
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter){
    acc = f(acc,a);
  }
  return acc;
})

// 함수 조합으로 함수 만들기
const total_price = pipe(
  map(p => p.price),
  reduce(add));

const base_total_price = predi => pipe(
  filter(predi),
  total_price
);

go(
  products,
  base_total_price(p => p.price < 20000),
);