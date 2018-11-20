const Calculator = require('calculator.js');

Page({
  data: {
    expression: '',
    output: '0',
    isCalculated: true, // 标记当前表达式是否已计算完毕
    lastInputChar: ''
  },
  onLoad: function () {

  },
  clickBtn(event) {
    const btnId = event.target.id;

    // 判断不同的按钮执行不同的操作
    switch (btnId) {
      case 'clear': // 清空
        this.setData({
          expression: '',
          output: '0',
          isCalculated: true,
          lastInputChar: ''
        })
        break;

      case 'backspace': // 退格
        if (!this.data.isCalculated) {
          let s = this.data.output;
          this.setData({
            output: s.substring(0, s.length - 1),
            lastInputChar: s[s.length - 2] || ''
          })
        }
        break;

      case '.': // 小数点
        if (!this.data.isCalculated && this.data.lastInputChar !== '(' && this.data.lastInputChar !== ')') {
          // 每个操作数只会包含一个小数点，需要判断
          const lastNum = this.getLastEnterNum();
          if (lastNum.indexOf('.') === -1) {
            this.addValidEnter('.');
          }
        }
        break;

      case '(': // 左括号
        if (this.data.isCalculated) {
          this.setData({
            output: '(',
            expression: '',
            lastInputChar: '(',
            isCalculated: false
          })
        } else if (this.data.lastInputChar.match(/[+|\-|×|÷|(]/)) {
          this.addValidEnter(btnId);
        }

        break;

      case ')': // 右括号
        if (this.data.lastInputChar.match(/[+|\-|×|÷|(]/)) break;
        this.addValidEnter(btnId);
        break;

      case '=': // 计算结果
        if (!this.data.isCalculated && this.data.lastInputChar !== '(') {
          // 因为没有做记录功能，先存到缓存方便调试
          wx.setStorage({
            key: 'expression',
            data: this.data.output,
          })

          const expression = this.data.output;
          const calculator = new Calculator(expression);
          // let result = this.calculate(expression);
          let result = calculator.calculate();
          if (isNaN(result)) { // 返回的不是数字，证明表达式不合法
            this.setData({
              expression: result,
              output: '',
              isCalculated: true,
              lastInputChar: ''
            })
          } else {
            // 结果的长度限制一下
            result = '= ' + result; // 剩下最后的一个操作数就是结果
            if (result.length > 15) {
              result = result.substring(0, 15);
            }

            this.setData({
              expression: expression,
              output: result,
              isCalculated: true,
              lastInputChar: ''
            })
          }
        }
        break;

        // 操作符
      case '+':
      case '-':
      case '×':
      case '÷':

        if (this.data.lastInputChar === '(') break; // 操作符不能跟在'('后面

        // 如果已经计算完毕，则相当于对上一次计算出的结果进行继续的计算
        if (this.data.isCalculated) {
          this.setData({
            output: this.data.output.substring(2, this.data.output.length), // 因为this.data.output显示为形如“= xxx”的格式，所以从2开始取
            expression: ''
          })
        }

        // 没有任何输入的情况下第一个输入了操作符，那就默认把第一个操作数设为0
        if (this.data.output === '') {
          this.setData({
            output: '0'
          })
        } else {
          let match = this.data.lastInputChar.match(/[+|\-|×|÷]/);
          // 如果连续输入两个操作符，就替换上一个操作符
          if (match && match.index === 0) {
            let val = this.data.output;
            val = val.substring(0, val.length - 1) + btnId;
            this.setData({
              output: val,
              lastInputChar: btnId
            });
          } else {
            this.addValidEnter(btnId);
          }
        }

        break;

      default:
        { // 数字
          if (this.data.lastInputChar === ')') break;

          // 如果已经计算完毕，把output值清空，去掉0占位字符
          if (this.data.isCalculated) {
            this.setData({
              output: '',
              expression: ''
            })
          }

          const lastNum = this.getLastEnterNum();
          // 如果最后一个输入是0开头的数字，此时再输入数字的话把0替换掉
          if (lastNum === '0' && !this.data.lastInputChar.match(/[+|\-|×|÷]/)) {
            const val = this.data.output;
            this.setData({
              output: val.substring(0, val.length - 1)
            })
          }

          this.addValidEnter(btnId);

          break;
        }
    }
  },
  /**
   * 输入一个合法字符
   */
  addValidEnter(val) {
    this.setData({
      output: this.data.output + val,
      lastInputChar: val
    })

    // 有新的输入要重置一下isCalculated值
    if (this.data.isCalculated) {
      this.setData({
        isCalculated: false
      })
    }
  },
  /**
   * 获取表达式中最后输入的操作数
   */
  getLastEnterNum() {
    const arr = this.data.output.split(/[+|\-|×|÷]/g).filter(d => d); // 根据操作符分割字符串并去掉空结果
    return arr[arr.length - 1]; // 取出最后输入的操作数
  },
  // /**
  //  * 计算结果并返回（按‘=’时触发）
  //  */
  // calculate(expression) {
  //   const operators = expression.match(/[+|\-|×|÷]/g); // 运算符数组
  //   const nums = expression.split(/[+|\-|×|÷]/g).filter(d => d).map(Number); // 运算参数数组

  //   // 没有输入操作符
  //   if (!operators) {
  //     return Number(expression);
  //   }

  //   // 如果表达式的最后一个输入是操作符，舍弃掉这个操作符
  //   if (operators.length >= nums.length) {
  //     operators.pop();
  //   }

  //   // 进行四则运算
  //   let i, val;
  //   for (i = 0; i < operators.length; i++) {
  //     // 先乘除
  //     if (operators[i] === '×' || operators[i] === '÷') {
  //       if (operators[i] === '×') { // 取出运算符两边的数进行运算
  //         val = nums[i] * (nums[i + 1]);
  //       } else {
  //         val = nums[i] / (nums[i + 1]);
  //       }

  //       operators.splice(i, 1); // 计算完的运算符删掉
  //       nums.splice(i, 2, val); // 计算完的结果替换原来的两个参数

  //       i--; // 因为删掉了当前位置的运算符，下一次取的应该还是这个位置
  //     }
  //   }

  //   // 后加减
  //   i = 0;
  //   while (operators.length > 0) {
  //     if (operators[i] === '+') {
  //       val = nums[i] + nums[i + 1];
  //     } else {
  //       val = nums[i] - nums[i + 1];
  //     }

  //     operators.splice(i, 1); // 计算完的运算符删掉
  //     nums.splice(i, 2, val); // 计算完的结果替换原来的两个参数
  //   }

  //   return nums[0]; // 剩下最后的一个操作数就是结果
  // }
})