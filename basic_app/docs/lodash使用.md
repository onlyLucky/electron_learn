<div align="center">
  <h1>lodash</h1>
  <p>Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。让 JavaScript 变得更简单</p>
  <p>开发过程中，有些使用场景方便了自己对数据处理.下面暂时会根据场景进行文档补充，同时会补充js</p>
</div>

## 目录

- [目录](#目录)
- [TODO](#todo)
- [使用场景](#使用场景)
  - [1.取对象中的部分属性](#1取对象中的部分属性)
- [参考链接](#参考链接)

## TODO

- [ ] API 使用完善
- [ ] 快速使用文档添加
- [ ] 补充场景使用，原生 js 实现

## 使用场景

### 1.取对象中的部分属性

- 使用 lodash 中的 pick 实现

```js
var object = { a: 1, b: "2", c: 3 };

_.pick(object, ["a", "c"]);
// => { 'a': 1, 'c': 3 }
```

- 原生 js 实现

```js
let obj = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
};
function pick(obj, pickArr) {
  let res = {};
  return pickArr.reduce((res, item) => {
    if (item in obj) {
      res[item] = obj[item];
    }
    return res;
  }, {});
}
pick(obj, ["a", "c"]); // {a: 1, c: 3}
```

## 参考链接

- [Markdown 官方教程](https://markdown.com.cn/)
- [Lodash 中文文档](https://www.lodashjs.com/)
