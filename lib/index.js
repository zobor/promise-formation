"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOneFromArray = function(v, array) {
  return array.filter(function(item) {
    return item !== v;
  });
};
var promiseFormation = function(promiseList, max, options) {
  if (max === void 0) {
    max = 2;
  }
  var running = [];
  var tasks = promiseList.slice(0);
  var isSuccess = true;
  var result = [];
  var next = function(resolve, reject) {
    // 队列执行完毕
    var isTaskFinish = tasks.length === 0 && running.length === 0;
    var isBreakOff = options && options.stop;
    if (isTaskFinish || isBreakOff) {
      if (isBreakOff || !isSuccess) {
        reject(result);
      } else {
        resolve(result);
      }
    }
    // 递归下一个轮循
    else {
      var availableNumber = max - running.length;
      if (availableNumber > 0) {
        tasks.slice(0, availableNumber).forEach(function(task) {
          var index = promiseList.indexOf(task);
          tasks = exports.removeOneFromArray(task, tasks);
          running.push(task);
          task()
            .then(function(res) {
              if (typeof result[index] === "undefined") {
                result[index] = res;
              }
              running = exports.removeOneFromArray(task, running);
              next(resolve, reject);
            })
            .catch(function(err) {
              isSuccess = false;
              running = exports.removeOneFromArray(task, running);
              if (typeof result[index] === "undefined") {
                result[index] = err;
              }
              next(resolve, reject);
            });
        });
      }
    }
  };
  return new Promise(function(resolve, reject) {
    if (options && !options.addOne) {
      // eslint-disable-next-line no-param-reassign
      options.addOne = function(fn) {
        promiseList.push(fn);
        tasks.push(fn);
        next(resolve, reject);
      };
    }
    // stop current promise and skip next
    if (options && !options.stopOne) {
      // eslint-disable-next-line no-param-reassign
      options.stopOne = function(taskId) {
        var runningIndex = running
          .map(function(item) {
            return item.id;
          })
          .indexOf(taskId);
        // 还没有启动的任务
        if (runningIndex === -1) {
          var taskIdx = tasks
            .map(function(item) {
              return item.id;
            })
            .indexOf(taskId);
          if (taskIdx > -1) {
            var tsk = tasks[taskIdx];
            tasks = exports.removeOneFromArray(tsk, tasks);
            var rIndex = promiseList
              .map(function(item) {
                return item.id;
              })
              .indexOf(taskId);
            result[rIndex] = new Error("cancel");
          }
          return;
        }
        var taskIndex = promiseList
          .map(function(item) {
            return item.id;
          })
          .indexOf(taskId);
        var task = running[runningIndex];
        running = exports.removeOneFromArray(task, running);
        result[taskIndex] = new Error("cancel");
        next(resolve, reject);
      };
    }
    // 立即开始
    next(resolve, reject);
  });
};
exports.default = promiseFormation;
