const { analyse } = require("./ast/analyse");
const { parse } = require("acorn");
const MagicString = require("magic-string");
class Module {
  constructor({ code, path, bundle }) {
    // 使用 magicString 是为了更好的处理 code（string）
    // 提供了很多处理 string 的方法
    this._code = new MagicString(code, {
      filename: path,
    });

    this._path = path;
    this._bundle = bundle;
    // 基于当前的 code 生成 ast
    this._ast = parse(code, {
      ecmaVersion: 7,
      sourceType: "module",
      locations: true,
    });
    this.analyse();
  }
  analyse() {
    analyse(this._ast, this._code, this);
  }

  expandAllStatements() {
    const statements = [];
    this._ast.body.forEach((statement) => {
      // 看看当前的 statement 是不是 import
      console.log(statement);
      if (statement.type === "ImportDeclaration") {
        // 遇到 import 的语句 ，需要特殊处理
      } else {
        statements.push(this.expandStatement(statement));
      }
    });

    return statements;
  }

  expandStatement(statement) {
    // 给一个标记
    statement._included = true;
    return statement;
  }
}

module.exports = {
  Module,
};
