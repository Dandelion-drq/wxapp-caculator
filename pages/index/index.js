Page({
  data: {
    expression: '',
    output: '0',
    isCalculated: true, // 标记当前表达式是否已计算完毕
    lastInputChar: null
  },
  onLoad: function () {

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
    } else if (btnId === '=') { // 计算
      // 计算结果
    } else if (btnId === '.') { // 小数点

      // 每个操作数只会包含一个小数点，需要判断
      const arr = this.data.output.split(/[+|\-|×|÷]/g).filter(d => d) /*去除空值*/ ;
      const last = arr[arr.length - 1]; // 取出最后输入的操作数
      if (last.indexOf('.') === -1) {
        this.addValidEnter('.');
      }

      this.setCalculated(false);
    } else {

      // 如果已经计算完毕，把output值清空，去掉0占位字符
      if (this.data.isCalculated) {
        this.setData({
          output: ''
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
      } else { // 输入数字或小数点
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
  }
})