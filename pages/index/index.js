Page({
  data: {
    expression: '',
    output: '0',
    isCalculated: true, // 标记当前表达式是否已计算完毕
    lastInputChar: null
  },
  onLoad: function() {

  },
  clickBtn(event) {
    const btnId = event.target.id;

    // 分辨判断不同的按钮执行不同的操作
    if (btnId === 'clear') { // 清空
      this.setData({
        expression: '',
        output: '0',
        isCalculated: true
      })

    } else if (btnId === 'backspace') { // 退格
      if (!this.data.isCalculated) {
        this.setData({
          output: this.data.output.substring(0, this.data.output.length - 1)
        })
      }

    } else if (btnId === 'history') { // 查看历史
      // todo: 跳转到历史页面

    } else if (btnId === '=') { // 计算结果
      if (!this.data.isCalculated) {
        this.calculate();
      }

    } else if (btnId === '.') { // 小数点

      // 每个操作数只会包含一个小数点，需要判断
      const lastNum = this.getLastEnterNum();
      if (lastNum.indexOf('.') === -1) {
        this.addValidEnter('.');
      }

      this.setCalculated(false);

    } else {

      // 如果已经计算完毕，把output值清空，去掉0占位字符
      if (this.data.isCalculated) {
        this.setData({
          output: '',
          expression: ''
        })
      }

      if (btnId === '+' || btnId === '-' || btnId === '×' || btnId === '÷') { // 输入的是操作符

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

      } else { // 输入数字
        const lastNum = this.getLastEnterNum();
        // 如果最后一个输入是0开头的数字，此时再输入数字的话把0替换掉
        if (lastNum === '0' && !this.data.lastInputChar.match(/[+|\-|×|÷]/)) {
          const val = this.data.output;
          this.setData({
            output: val.substring(0, val.length - 1)
          })
        }

        this.addValidEnter(btnId);
      }

      // 有新的输入要重置一下isCalculated值
      this.setCalculated(false);
    }
  },
  /**
   * 设置isCalculated值
   */
  setCalculated(val) {
    this.setData({
      isCalculated: val
    })
  },
  /**
   * 输入一个合法字符
   */
  addValidEnter(val) {
    this.setData({
      output: this.data.output + val,
      lastInputChar: val
    })
  },
  /**
   * 获取表达式中最后输入的操作数
   */
  getLastEnterNum() {
    const arr = this.data.output.split(/[+|\-|×|÷]/g).filter(d => d); // 根据操作符分割字符串并去掉空结果
    return arr[arr.length - 1]; // 取出最后输入的操作数
  },
  /**
   * 计算结果（按‘=’时触发）
   */
  calculate() {
    const expression = this.data.output;
    const operators = expression.match(/[+|\-|×|÷]/g); // 运算符数组
    const nums = expression.split(/[+|\-|×|÷]/g).filter(d => d).map(Number); // 运算参数数组

    // 如果表达式的最后一个输入是操作符，舍弃掉这个操作符
    if (operators.length >= nums.length) {
      operators.pop();
    }

    // 进行四则运算
    let i, val;
    for (i = 0; i < operators.length; i++) {
      // 先乘除
      if (operators[i] === '×' || operators[i] === '÷') {
        if (operators[i] === '×') { // 取出运算符两边的数进行运算
          val = nums[i] * (nums[i + 1]);
        } else {
          val = nums[i] / (nums[i + 1]);
        }

        operators.splice(i, 1); // 计算完的运算符删掉
        nums.splice(i, 2, val); // 计算完的结果替换原来的两个参数

        i--; // 因为删掉了当前位置的运算符，下一次取的应该还是这个位置
      }
    }

    // 后加减
    i = 0;
    while (operators.length > 0) {
      if (operators[i] === '+') {
        val = nums[i] + nums[i + 1];
      } else {
        val = nums[i] - nums[i + 1];
      }

      operators.splice(i, 1); // 计算完的运算符删掉
      nums.splice(i, 2, val); // 计算完的结果替换原来的两个参数
    }

    // 结果的长度限制一下
    let result = '= ' + nums[0];
    if (result.length > 15) {
      result = result.substring(0, 15);
    }

    // 剩下最后的一个操作数就是结果
    this.setData({
      expression: expression,
      output: result,
      isCalculated: true,
      lastInputChar: null
    })
  }
})