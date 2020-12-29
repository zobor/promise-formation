import promiseOneByOne from "../src";

jest.setTimeout(1000);

const getPromises = (len: number): any =>
  Array(len)
    .fill(null)
    .map((_, index) => () =>
      new Promise(async resolve => {
        await new Promise(rs => {
          setTimeout(() => {
            rs();
          }, 100);
        });
        resolve(index + 1);
      })
    );

const getPromisesFail = (len: number): any =>
  Array(len)
    .fill(null)
    .map((_, index) => () =>
      new Promise(async (resolve, reject) => {
        await new Promise(rs => {
          setTimeout(() => {
            rs();
          }, 100);
        });
        reject(new Error(`error-promise-${index + 1}`));
      })
    );

const delay = time =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

const isError = v => Object.prototype.toString.call(v) === "[object Error]";

jest.setTimeout(30000);
describe("setTimeout test", () => {
  it("like Promise.all", async () => {
    jest.setTimeout(400);
    promiseOneByOne(getPromises(3)).then((res: number[]) => {
      expect(res.join()).toEqual("1,2,3");
    });

    await delay(400);
  }, 1000);

  it("concurrency run", async () => {
    jest.setTimeout(900);

    promiseOneByOne(getPromises(9), 3).then((res: number[]) => {
      expect(res.join()).toEqual("1,2,3,4,5,6,7,8,9");
    });

    await delay(900);
  }, 1000);

  it("add one", async () => {
    jest.setTimeout(300);

    const promiseOptions: any = {};
    promiseOneByOne(getPromises(2), 1, promiseOptions).then((res: number[]) => {
      expect(res.join()).toEqual("1,2,1");
    });
    promiseOptions.addOne(getPromises(1)[0]);

    await delay(300);
  }, 1000);

  it("stop one", async () => {
    jest.setTimeout(300);

    const promiseOptions: any = {};
    const p = getPromises(3).map((fn: any, index: number) => {
      // eslint-disable-next-line no-param-reassign
      fn.id = `test-${index + 1}`;
      return fn;
    });
    promiseOneByOne(p, 1, promiseOptions).then((res: any[]) => {
      expect(res.length).toEqual(3);
      expect(isError(res[1])).toBeTruthy();
    });
    promiseOptions.stopOne("test-2");

    await delay(300);
  }, 1000);

  it("stop running", async () => {
    jest.setTimeout(300);

    const promiseOptions: any = {};
    const p = getPromises(3).map((fn: any, index: number) => {
      // eslint-disable-next-line no-param-reassign
      fn.id = `test-${index + 1}`;
      return fn;
    });
    promiseOneByOne(p, 1, promiseOptions).then((res: any[]) => {
      expect(res.length).toEqual(3);
      expect(isError(res[0])).toBeTruthy();
    });
    promiseOptions.stopOne("test-1");

    await delay(300);
  }, 1000);

  it("fail case", async () => {
    jest.setTimeout(300);

    const p1 = getPromises(1)[0];
    const p2 = getPromisesFail(1)[0];
    promiseOneByOne([p1, p2])
      .then()
      .catch((rs: any[]) => {
        expect(rs.length).toEqual(2);
      });

    await delay(300);
  }, 1000);
});
