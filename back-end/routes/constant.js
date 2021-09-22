const router = require('koa-router')()
const koa2Req = require('koa2-request'); //发起请求插件
router.prefix('/constant')

// 获取版本信息
router.get('/getVersion', function (ctx, next) {
  const version = ctx.cookies.get('version');
  // 客户端没有做登录，这里直接用query中的字段代表用户信息，在实际项目中，这里应该是读取客户端的用户信息的
  const uuid = ctx.query.uuid; //这里只是演示，直接通过链接获取用户id，实际场景应该是通过获取用户会话去判别用户相关信息
  const uuids = ['123','456','789'] //可以进入灰度版本的uuid，在数据库存放
  //redis 中存放了的的用户id，如果清理了redis，则意味着，取消用户的版本标识，这里简单的用数组存放，实际应用场景根据各自的业务信息考虑是否需要多集合存放
  const redisUuids = [{id: '789', version: 'beta'}, {id: '333', version: 'stable'}]; 
  let cache = false;
  // cookie中存在版本信息，并且用户id在redis中有记载
  // cookie中存在version，那么说明已经给客户端判断过版本了，再去和redis中的用户id集合比对，判断是否存在，存在则不需要用户重新获取，如果不存在了，说明需要用户重新获取
  if((version)) {
    cache = true
  }else {
    const uItem = redisUuids.find((i)=> i.id === uuid)
    if(uItem) {
      // redis中存在，则直接返回redis存放的版本
      ctx.cookies.set('version', uItem.version);
    }else {
      // 灰度验证流程，这里设置cookie的时长为1个小时，可以根据自己的场景灵活调整，如果是时间设置长了，最好在会话过期或者退出登录的时候需要做清除cookie的操作
      if(uuids.includes(uuid)) {
        ctx.cookies.set('version', 'beta', {maxAge:3600000});
      }else {
        ctx.cookies.set('version', 'stable', {maxAge:3600000});
      }
      // ctx.cookies.set('vvid', '123'); //客户端标识，可通过设置一个唯一标识作为记号，这里作为演示，不加，实际根据业务场景使用
      // 这里还可以将用户信息存入redis中，作为后台管理展示数据
    }
  }
  ctx.body = {
    'code': 1,
    'data': uuids.includes(uuid) ? 'beta' : 'stable',
    'ctx': ctx.request.href,
    'message': cache ? '缓存' : '重新计算'
  }
})



module.exports = router
