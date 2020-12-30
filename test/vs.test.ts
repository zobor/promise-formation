import promiseFormation from "../src";

const delay = (time: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

jest.setTimeout(70);
it("Promise.all", async () => {
  const seq = [];
  const p1 = new Promise(resolve => {
    setTimeout(() => {
      seq.push("A");
      resolve("A");
    }, 30);
  });
  const p2 = new Promise(resolve => {
    setTimeout(() => {
      seq.push("B");
      resolve("B");
    }, 20);
  });
  const p3 = new Promise(resolve => {
    setTimeout(() => {
      seq.push("C");
      resolve("C");
    }, 10);
  });

  Promise.all([p1, p2, p3]).then(rs => {
    expect(rs).toEqual(["A", "B", "C"]);
    expect(seq).toEqual(["C", "B", "A"]);
  });
  await delay(70);
});

it("Promise.formation", async () => {
  const seq = [];
  const p1 = () =>
    new Promise(resolve => {
      setTimeout(() => {
        seq.push("A");
        resolve("A");
      }, 30);
    });
  const p2 = () =>
    new Promise(resolve => {
      setTimeout(() => {
        seq.push("B");
        resolve("B");
      }, 20);
    });
  const p3 = () =>
    new Promise(resolve => {
      setTimeout(() => {
        seq.push("C");
        resolve("C");
      }, 10);
    });

  promiseFormation([p1, p2, p3]).then(rs => {
    expect(rs).toEqual(["A", "B", "C"]);
    expect(seq).toEqual(["A", "B", "C"]);
  });
  await delay(70);
});
