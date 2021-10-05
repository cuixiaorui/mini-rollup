# mini-rollup

实现 mini-rollup 学习 rollup 原理

## Tasking

- [ ] 如何解析 import 的文件
  1.  获取到所有 import 的语句
  2. 继续调用 fetchModule
  3. 把生成的 statements 添加到整体的数组内
