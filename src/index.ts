type ITask = () => Promise<any>;

export const removeOneFromArray = (v: any, array: any[]) =>
  array.filter(item => item !== v);

const promiseFormation = (
  promiseList: ITask[],
  max = 2,
  options?: {
    addOne?: any;
    stop?: boolean;
    stopOne?: any;
  }
) => {
  let running: any[] = [];
  let tasks = promiseList.slice(0);
  let isSuccess = true;
  const result: any[] = [];
  const next = (resolve: any, reject: any) => {
    // 队列执行完毕
    const isTaskFinish = tasks.length === 0 && running.length === 0;
    const isBreakOff = options && options.stop;
    if (isTaskFinish || isBreakOff) {
      if (isBreakOff || !isSuccess) {
        reject(result);
      } else {
        resolve(result);
      }
    }
    // 递归下一个轮循
    else {
      const availableNumber = max - running.length;
      if (availableNumber > 0) {
        tasks.slice(0, availableNumber).forEach((task: any) => {
          const index = promiseList.indexOf(task);
          tasks = removeOneFromArray(task, tasks);
          running.push(task);
          task()
            .then((res: any) => {
              if (typeof result[index] === "undefined") {
                result[index] = res;
              }
              running = removeOneFromArray(task, running);
              next(resolve, reject);
            })
            .catch((err: Error) => {
              isSuccess = false;
              running = removeOneFromArray(task, running);
              if (typeof result[index] === "undefined") {
                result[index] = err;
              }
              next(resolve, reject);
            });
        });
      }
    }
  };

  return new Promise((resolve, reject) => {
    if (options && !options.addOne) {
      // eslint-disable-next-line no-param-reassign
      options.addOne = (fn: any) => {
        promiseList.push(fn);
        tasks.push(fn);
        next(resolve, reject);
      };
    }

    // stop current promise and skip next
    if (options && !options.stopOne) {
      // eslint-disable-next-line no-param-reassign
      options.stopOne = (taskId: string) => {
        const runningIndex = running.map(item => item.id).indexOf(taskId);
        // 还没有启动的任务
        if (runningIndex === -1) {
          const taskIdx = tasks.map((item: any) => item.id).indexOf(taskId);
          if (taskIdx > -1) {
            const tsk = tasks[taskIdx];
            tasks = removeOneFromArray(tsk, tasks);
            const rIndex = promiseList
              .map((item: any) => item.id)
              .indexOf(taskId);
            result[rIndex] = new Error("cancel");
          }
          return;
        }
        const taskIndex = promiseList
          .map((item: any) => item.id)
          .indexOf(taskId);
        const task = running[runningIndex];

        running = removeOneFromArray(task, running);
        result[taskIndex] = new Error("cancel");
        next(resolve, reject);
      };
    }

    // 立即开始
    next(resolve, reject);
  });
};

export default promiseFormation;
