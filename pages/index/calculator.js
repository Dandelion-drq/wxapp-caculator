class Calculator {
  constructor(expression) {
    this.expression = expression;
  }

  /**
   * 检查括号是否匹配
   */
  isParenthesesMatch() {
    let count = 0;
    for (const char of this.expression) {
      if (char === '(') {
        count++;
      } else if (char === ')') {
        count--;
      }
    }
    if (count === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 计算表达式
   */
  calculate() {
    if (!this.isParenthesesMatch()) {
      return '括号不匹配';
    }

    // 先把字符串转换为中缀表达式（即从字符串中识别出数字与符号）
    let infixExpression = []; // 中缀表达式
    for (let i = 0; i < this.expression.length; i++) {
      const char = this.expression[i];
      if (char.match(/[\d|.]/)) {
        let num = char;
        for (i++; i < this.expression.length; i++) {
          const s = this.expression[i];
          if (s.match(/[+|\-|×|÷|(|)]/)) {
            break;
          } else {
            num += s;
          }
        }
        infixExpression.push(Number(num));

        i--;
      } else {
        infixExpression.push(char);
      }
    }

    // 把中缀表达式转换为后缀表达式
    let postfixExpression = []; // 后缀表达式
    let stack = [];
    let op;
    for (const item of infixExpression) {
      switch (item) {
        case '(': // 遇到左括号，进栈
          stack.push('(');
          break;

        case ')': // 遇到右括号，一直出栈，直到匹配到最近的左括号
          {
            op = stack.pop();
            while (op && op != '(') {
              postfixExpression.push(op);
              op = stack.pop();
            }
            break;
          }

          // 当遇到运算符时，依次弹出栈中优先级大于等于当前的运算符，遇到左括号停止，再将当前运算符入栈
        case '+':
        case '-':
        case '×':
        case '÷':
          {
            op = stack[stack.length - 1]; // op指向栈顶元素
            if (op && op !== '(') { // 如果是左括号，不出栈
              if (item === '+' || item === '-') { // +、-
                while (op && op !== '(') {
                  op = stack.pop();
                  postfixExpression.push(op);
                  op = stack[stack.length - 1];
                }
              } else { // ×、÷
                while (op && (op === '×' || op === '÷')) {
                  op = stack.pop();
                  postfixExpression.push(op);
                  op = stack[stack.length - 1];
                }
              }
            }
            stack.push(item); // 当前运算符入栈
            break;
          }

          // 剩下的是数字，直接输出
        default:
          postfixExpression.push(item);
          break;
      }
    }
    // 最后把栈中剩下的所有内容弹出
    while (stack.length > 0) {
      op = stack.pop();
      postfixExpression.push(op);
    }

    // 计算后缀表达式
    stack = []; // 先把栈清空
    for (const item of postfixExpression) {
      if (!isNaN(item)) { // 数字直接压栈
        stack.push(item);
      } else { // 遇到操作符则把栈顶的两个数字取出进行计算，然后把计算结果进栈
        let num1 = stack.pop();
        let num2 = stack.pop();
        if (num1 && num2) {
          let result;
          switch (item) {
            case '+':
              result = num2 + num1;
              break;
            case '-':
              result = num2 - num1;
              break;
            case '×':
              result = num2 * num1;
              break;
            case '÷':
              result = num2 / num1;
              break;
            default:
              break;
          }
          stack.push(result);
        } else {
          return '表达式不合法';
        }
      }
    }

    if (stack.length === 1) {
      return stack[0]; // 最后栈中剩下的一个数就是结果
    } else {
      return '表达式不合法';
    }
  }
}

module.exports = Calculator;