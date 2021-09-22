## 目录介绍
```
back-end : 后端服务
 - router/constant.js : 灰度逻辑
```

```
front-end : 前端服务
 - etc : nginx配置相关
 - web : 前端项目
```


## 使用说明
构建后端服务容器：docker-compose build 
运行：docker-compose up -d   
访问: localhost:8000


## 测试说明
后台实现代码
``` js
const uuid = ctx.query.uuid; //这里只是演示，直接通过链接获取用户id，实际场景应该是通过获取用户会话去判别用户相关信息
const uuids = ['123','456','789'] //可以进入灰度版本的uuid，在数据库存放
//redis 中存放了的的用户id，如果清理了redis，则意味着，取消用户的版本标识，这里简单的用数组存放，实际应用场景根据各自的业务信息考虑是否需要多集合存放
const redisUuids = [{id: '789', version: 'beta'}, {id: '333', version: 'stable'}]; 
```
上面代码逻辑是当uuid为123或者456或者789的时候就命中灰度规则，就进入beta版本
redis中已经存放了uuid为789和333的用户了







