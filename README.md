# promise-formation

拓展 Promise.all 的功能，提供 Promise 调用队列

## install

```sh
npm i promise-formation -S
```

## Usage

### Promise.all

```js
const p1 = new Promise(resolve => {
  setTimeout(() => {
    console.log(1);
    resolve("A");
  }, 3);
});
const p2 = new Promise(resolve => {
  setTimeout(() => {
    console.log(2);
    resolve("B");
  }, 2);
});
const p3 = new Promise(resolve => {
  setTimeout(() => {
    console.log(3);
    resolve("C");
  }, 1);
});

Promise.all([p1, p2, p3]).then(rs => {
  console.log(rs);
});
// 3
// 2
// 1
// A B C
```

### Promilse.formation

```js
import promiseFormation from "promise-formation";

const p1 = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(1);
      resolve("A");
    }, 3);
  });
const p2 = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(2);
      resolve("B");
    }, 2);
  });
const p3 = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(3);
      resolve("C");
    }, 1);
  });

promiseFormation([p1, p2, p3]).then(rs => {
  console.log(rs);
  // 1
  // 2
  // 3
  // ["A", "B", "C"]
});
```

## Document

[http://regx.vip/post/2020/promise-formation/](http://regx.vip/post/2020/promise-formation/)
