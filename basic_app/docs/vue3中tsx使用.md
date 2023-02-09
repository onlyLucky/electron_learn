<div align="center">
  <h1>vue3中tsx使用</h1>
</div>

## 目录

- [目录](#目录)
- [Vue](#vue)
  - [V1.vue 中 hooks 的使用](#v1vue-中-hooks-的使用)
    - [01.方便使用](#01方便使用)
- [参考链接](#参考链接)

## Vue

### V1.vue 中 hooks 的使用

#### 01.方便使用

- 可以将导出的变量放置在与文件名称相同的函数中，比如`useTap.ts`中 声明一个`useTap()`

```ts
// useTap.ts
let tapFlag = ref<boolean>(false);
const useTap = () => {
  return {
    tapFlag,
  };
};

const handleTap = (flag: boolean) => {
  tapFlag.value = flag;
};

export { useTap, handleTap };
```

使用

```vue
<template>
  <div @click="handleTap(!tapFlag)">tap</div>
</template>
<script setup>
import { useTap, handleTap } from "./useTap.ts";
const { tapFlag } = useTap();
</script>
```

## 参考链接

[vue3 slot 插槽在 tsx 中的使用方法](https://blog.csdn.net/weixin_45291937/article/details/127869765)

很多 vue3 中 tsx 写法中可以在 react 的 tsx 中参考：
