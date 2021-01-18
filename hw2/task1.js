/**
 * Задача 1
Реализовать менеджер таймеров
1. Метод add должен добавлять таймер в очередь на выполнение. В качестве первого
параметра этот метод принимает объект описывающий таймер, а все последующие
параметры передаются как аргументы для callback функции таймера.
2. Вызовы метода add можно соединять manager.add(t1).add(t2, 1, 2);
3. Метод remove должен остановить определённый таймер и удалить его из очереди.
4. Метод start должен запустить все таймеры на выполнение.
5. Метод stop должен остановить все таймеры.
6. Метод pause приостанавливает работу конкретного таймера.
7. Метод resume запускает работу конкретного таймера
8. Таймеры могут быть как одноразовыми (выполнить задачу через определённый
промежуток времени), так и периодическими (выполнять задачу с определённым
интервалом). Если interval = true — таймер периодический.
Обратите внимание!
1. TimeManager должен вызывать ошибку если поле name содержит неверный тип,
отсутствует или пустая строка.
2. TimeManager должен вызывать ошибку если поле delay содержит неверный тип или
отсутствует.
3. TimeManager должен вызывать ошибку если delay меньше 0 и больше 5000.
4. TimeManager должен вызывать ошибку если поле interval содержит неверный тип
или отсутствует.
5. TimeManager должен вызывать ошибку если поле job содержит неверный тип или
отсутствует.
6. TimeManager должен вызывать ошибку если запустить метод add после старта.
7. TimeManager должен вызывать ошибку если попытаться добавить таймер с именем
котрое уже было добавлено.

 * Задача 2
Реализовать логгер для менеджера таймеров:
1. Необходимо добавить метод _log который будет записывать в массив логов
результат выполнения колбек функции таймера.
2. Необходимо добавить метод print который будет возвращать массив всех логов.

 * Задача 3
Улучшите имплементацию задачи 2.
1. Необходимо реализовать обработку ошибок возникающих внутри callback функций.
2. Если ошибка произошла, необходимо в лог добавить информацию об этой ошибке.
Обратите внимание!
1. При возникновении ошибки внутри callback функции выполнение программы не
должно завершаться с ошибкой.

 * Задача 4
Улучшите имплементацию задачи 3.
1. Реализовать общий таймаут для TimersManager. Время таймаута будет равняться
времени самого долгого таймера + 10 секунд.
2. По истечению временного лимита TimersManager должен пройтись по всем
таймерам и убить все таймеры.
 */

class TimersManager {
  constructor() {
    this.timers = [];
    this.timeouts = [];
    this.logs = [];
    this.timersStarted = false;
    this.killAll();
  }

  killAll(arg = "KILL ALL!!!") {
    let minTimer = 0;
    this.timers.forEach(el => el.delay > minTimer ? minTimer = el.delay : 0);
    minTimer+= 10000;
    setTimeout(() => console.log(arg), minTimer);
  }

  checkErr(timerObject) {
    let {name, delay, job, interval} = timerObject;
    if (name == "" || typeof name != "string") {
      throw new Error("Timer name must be a string with value");
    }
    if (delay < 0 || !Number.isInteger(delay) || delay > 5000  || delay == null){
      throw new Error("Timers delay must be a number with value bigger than 0 and smaller than 5000");
    }
    if (typeof interval != "boolean" || interval == null){
      throw new Error("Timers interval must be a boolean type");
    }
    if (typeof job !== "function" || job == null) {
      throw new Error("Timers job must be a function");
    }

    this.timers.forEach(el => {
      if (el.name == name) {
        throw new Error("Timers name must be a unic");
      }
    })

    if (this.timersStarted) {
      throw new Error("All timers started yet");
    }

  }

  add(timerObj, arg1 = null, arg2 = null) { 
      if (!this.checkErr(timerObj)) {
        let timer = Object.assign({}, timerObj);
        timer.arg1 = arg1;
        timer.arg2 = arg2;
    
        this.timers.push(timer);
       
        return this;
      }
  }

  remove(timerName) {
    let index = this.timers.findIndex((el) => {
      return el.name == timerName;
    });

    this.timeouts[index].unref();
    this.timeouts.splice(index, 1);
    this.timers.splice(index, 1);
  }

  _log(log) {
    this.logs.push(log);
  }

  start() {
    let timer;
    let timerLog;
    let timerFunc = (cb, ar1, ar2, name, date) => {
      try {
        var res = cb(ar1, ar2);
        timerLog = {
          name: name,
          in: [ar1, ar2],
          out: res, 
          created: date
        };
      }
      catch(e) {
        //console.log(e);
        timerLog = {
          name: name,
          in: [ar1, ar2],
          out: undefined,
          error: {
            name: e.name,
            message: e.message,
            stack: e.stack
          },
          created: date
        };
      }
      finally {
        
  
        this._log(timerLog);
      }    
    }
    this.timers.forEach(el => {
      if (el.interval) {
        timer = setInterval(timerFunc, el.delay, el.job, el.arg1, el.arg2, el.name, new Date());
        
      }
      else {
        timer = setTimeout(timerFunc, el.delay, el.job, el.arg1, el.arg2, el.name, new Date());
      }

      this.timeouts.push(timer);
      this.timersStarted = true;
    })
  }

  stop() {
    this.timeouts.forEach(el => el.unref());
  }

  
  pause(timerName) {
    let index = this.timers.findIndex((el) => {
      return el.name == timerName;
    });

    this.timeouts[index].unref();
  }

  resume(timerName) {
    let index = this.timers.findIndex((el) => {
      return el.name == timerName;
    });

    this.timeouts[index].ref();
  }

  print() {
    return this.logs;
  }
}

const manager = new TimersManager();

const t1 = {
  name: "t1",
  delay: 2000,
  interval: false,
  job: () => {
    console.log("t1");
  },
};

const t2 = {
  name: "t2",
  delay: 1000,
  interval: true,
  job: (a, b) => (a+b),
};

const testTimer = {
  name: "t3",
  delay: 1000,
  interval: false,
  job: () => {throw new Error("We have a problem")},  
};

manager.add(t1).add(t2, 1, 2);
manager.add(testTimer);
//manager.add(t2, 1, 2);
manager.start();
console.log(1);
manager.pause("t2");

manager.killAll(manager.print());
