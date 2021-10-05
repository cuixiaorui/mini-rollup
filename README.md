# mini-rollup

实现 mini-rollup 学习 rollup 原理

## Tasking

- [x] 如何解析 import 的文件
思考一下的话，其实我们的目标就是获取其他文件的所有的 statements， 添加到总的 statements 里面即可，因为这样就可以输出了
  1.  获取到所有 import 的语句
  2. 继续调用 fetchModule
  3. 把生成的 statements 添加到整体的数组内
  4. 最后在 generate 阶段对 statement 做处理，比如可以在这个阶段删除 export


## 理论

1. 先使用 fs 来获取到 input 文件的代码
2. 然后使用 analyse 来基于 code 生成 ast
3. 有了 ast 之后，这里就可以基于不同的 node 来做处理了
4. 然后把 node 给返回出去（也就是对应的 statement）
5. 接着把 node 对应的 code 给拼接起来即可(使用 magic-string)
