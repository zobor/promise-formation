(() => {
  // src/index.ts
  var removeOneFromArray = (v, array) => array.filter(item => item !== v);
  var promiseFormation = (promiseList, max = 1, options) => {
    let running = [];
    let tasks = promiseList.slice(0);
    let isSuccess = true;
    const result = [];
    const next = (resolve, reject) => {
      const isTaskFinish = tasks.length === 0 && running.length === 0;
      const isBreakOff = options && options.stop;
      if (isTaskFinish || isBreakOff) {
        if (isBreakOff || !isSuccess) {
          reject(result);
        } else {
          resolve(result);
        }
      } else {
        const availableNumber = max - running.length;
        if (availableNumber > 0) {
          tasks.slice(0, availableNumber).forEach(task => {
            const index = promiseList.indexOf(task);
            tasks = removeOneFromArray(task, tasks);
            running.push(task);
            task()
              .then(res => {
                if (typeof result[index] === "undefined") {
                  result[index] = res;
                }
                running = removeOneFromArray(task, running);
                next(resolve, reject);
              })
              .catch(err => {
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
        options.addOne = fn => {
          promiseList.push(fn);
          tasks.push(fn);
          next(resolve, reject);
        };
      }
      if (options && !options.stopOne) {
        options.stopOne = taskId => {
          const runningIndex = running.map(item => item.id).indexOf(taskId);
          if (runningIndex === -1) {
            const taskIdx = tasks.map(item => item.id).indexOf(taskId);
            if (taskIdx > -1) {
              const tsk = tasks[taskIdx];
              tasks = removeOneFromArray(tsk, tasks);
              const rIndex = promiseList.map(item => item.id).indexOf(taskId);
              result[rIndex] = new Error("cancel");
            }
            return;
          }
          const taskIndex = promiseList.map(item => item.id).indexOf(taskId);
          const task = running[runningIndex];
          running = removeOneFromArray(task, running);
          result[taskIndex] = new Error("cancel");
          next(resolve, reject);
        };
      }
      next(resolve, reject);
    });
  };
  var src_default = promiseFormation;
})();
