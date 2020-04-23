### vue-cli3基础h5模板
### 基于vue-cli3的h5框架
#### 使用步骤
首先npm install安装依赖包
在.env文件配置开发和生成环境下的参数
在oss.js文件配置自动上传阿里云的目录
npm run dev启动开发版
npm run build:test打包线上测试版
npm run oss打包线上测试版并上传阿里云
npm run build打包线上正式版
#### 配置结构
##### 根目录下：
.env文件（配置环境）
vue.config.js（配置webpack）
##### src下：
config下的baseConfig（配置上报信息等）
request（请求相关）
sdk（数据上报相关）
##### public下：
lib下的rem（配置移动端适配）
.env文件相关介绍
.env.dev
NODE_ENV区分环境（不可修改）
VUE_APP_BASE_ENV区分正式和测试
VUE_APP_BASE_API接口地址
.env.test与.env.test.prod
多了VUE_APP_BASE_PATH，作为阿里云筒的二级目录
env位置
env内容

#### 请求相关
发请求前先在request文件夹下的apis.js添加路由，然后通过引入request.js文件发起请求
url：请求的路径
method：请求的方法
model：请求的模式（3种，默认，等待和队列，参考小程序原生框架）
添加请求api对象

##### 发送请求
name：路由表里的请求名字
data：请求的参数

##### rem适配
在public文件夹下的lib里的rem文件修改DEVICEWIDTH，对应当前的设备宽度

##### 数据上报
sdk文件夹下的statistics文件，上报的方法为this.sendkv({key: ‘对应的key值’})

##### 注意
关于dev命令
npm run dev命令会将.env.dev文件的配置作为环境配置，用于开发版测试
关于build命令
不同的build命令会打包不同环境配置
npm run build:test命令会将.env.test文件的配置作为环境配置并打包
npm run build命令会将.env.prod文件的配置作为环境配置并打包
npm run oss命令会将.env.test文件的配置作为环境配置并打包然后上传阿里云（需要在oss.js文件下修改上传目录）
