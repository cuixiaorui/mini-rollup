const fs = require("fs");
const path = require('path');
const MagicString = require("magic-string");
const { Module } = require("./Module");
class Bundle {
  constructor(options) {
    this._options = options;
    this._entry = options.config.input;
    this._statements = null;
  }

  build() {
    // 1. 先基于 entry 文件来开始 -> 转换成 Module
    const entryModule = this.fetchModule(this._entry);
    // 2. 对入口文件抽象语法树进行依赖解析
    this._statements = entryModule.expandAllStatements();
    // 3. 生成最终的代码
    const { code } = this.generate();
    // 4. 保存到file

    //     // 获取一个可以输出的文件路径
    const { config } = this._options;
    const entryDir = path.dirname(config.input);
    const filename = path.join(entryDir, config.output.filename);
    fs.writeFileSync(filename, code);
    //     console.log("filename", filename);
  }

  fetchModule(importee) {
    // 使用 fs 来读取文件的内容
    const code = fs.readFileSync(importee, "utf-8");
    const module = new Module({
      code,
      path: importee,
      bundle: this,
    });

    return module;
  }

  generate() {
    const ms = new MagicString.Bundle();
    this._statements.forEach((statement) => {
      const source = statement._source.clone();
      ms.addSource({
        content: source,
        separator: "\n",
      });
    });

    return {
      code: ms.toString(),
    };
  }
}

module.exports = {
  Bundle,
};
