const { analyse } = require("./ast/analyse");
const path = require("path");
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
    this._imports = [];
    this.analyse();
  }
  analyse() {
    // 1. 收集所有的 import
    // 2. 然后使用 fetchModule 去拉取这个模块的 statements
    // 3. 然后push 到 statements 内

    this._ast.body.forEach((statement) => {
      if (statement.type === "ImportDeclaration") {
        this._imports.push(statement);
      }
    });

    analyse(this._ast, this._code, this);
  }

  expandAllStatements() {
    const statements = [];

    console.log("先处理依赖");
    this._imports.forEach((node) => {
      // 需要把这个路径转换成全局路径
      // TODO 暂时只处理了相对路径
      // 看看有没有 .js ，如果没有的话 ，那么就给加个 .js
      const sourceValue = node.source.value.endsWith(".js")
        ? node.source.value
        : node.source.value + ".js";

      const importee = path.resolve(path.dirname(this._path), sourceValue);

      const module = this._bundle.fetchModule(importee);
      statements.push(...module.expandAllStatements());
    });

    this._ast.body.forEach((statement) => {
      if (!(statement.type === "ImportDeclaration")) {
        statements.push(this.expandStatement(statement));
      }
    });
    console.log(statements)

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
