# base-h5

小黑屋基础h5模板


### 文件目录




### 本地预览


[https://cli.vuejs.org/zh/guide/deployment.html#%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88](https://cli.vuejs.org/zh/guide/deployment.html#%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88)


dist 目录需要启动一个 HTTP 服务器来访问 (除非你已经将 publicPath 配置为了一个相对的值)，所以以 file:// 协议直接打开 dist/index.html 是不会工作的。在本地预览生产环境构建最简单的方式就是使用一个 Node.js 静态文件服务器，例如 serve：

```
npm install -g serve
# -s 参数的意思是将其架设在 Single-Page Application 模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```

