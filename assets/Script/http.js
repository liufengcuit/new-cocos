export default {
    /**登录 */
    login:function(params, call) {
        return request('/v1/auth/login', params, call)
    },
    /**检查用户今天是否还能继续挑战 */
    challengeCheck:function(params, call) {
        return request('v1/game/challenge-check', params, call)
    },
    /**游戏得分上报 */
    point:function(params, call) {
        return request('v1/game/point', params, call)
    },
    /**分享请求 */
    share:function(params, call) {
        return request('/v1/share/share', params, call)
    },
    /**邀请分享回调 */
    inviteBack:function(params, call) {
        return request('/v1/share/invite-back', params, call)
    },
    /**邀请分享入场券回调 */
    inviteTicket: function(params, call) {
        return request('/v1/share/invite-ticket', params, call)
    },
    /**挑战分享回调 */
    challengeBack:function(params, call) {
        return request('/v1/share/challenge-back', params, call)
    },
    /**是否还能参与摇奖 */
    isCanLottery:function(params, call) {
        return request('/v1/doll/is-can-lottery', params, call)
    },
    /**开始摇奖 */
    lottery:function(params, call) {
        return request('/v1/doll/lottery', params, call)
    },
    /**我的娃娃 */
    user:function(params, call) {
        return request('/v1/doll/user', params, call)
    },
    /**更多好玩 */
    more:function(params, call) {
        return request('/v1/game/more', params, call)
    },
    /**获取用户复活卡 */
    lifeCard:function(params, call) {
        return request('/v1/user/life-card', params, call)
    },
    /**更新用户session接口 */
    session:function(params, call) {
        return request('/v1/user/session', params, call)
    },
    /**使用复活卡 */
    useLifeCard:function(params, call) {
        return request('/v1/game/life-card', params, call)
    },
    /**获取用户最多拥有复活卡数量 */
    maxLifeCard:function(params, call) {
        return request('/v1/user/max-lifecard', params, call)
    },
    /**相关配置数据 */
    config:function(params, call) {
        return request('/v1/config/index', params, call)
    },
    /**获取用户娃娃数量信息 */
    number:function(params, call) {
        return request('/v1/doll/number', params, call)
    },
    /**合成娃娃接口 */
    compose:function(params, call) {
        return request('/v1/doll/compose', params, call)
    },
    /**获取分享配置 */
    shareConfig:function(params, call) {
        return request('/v1/share/config', params, call)
    },
    /**广告位 */
    ad: function(params, call) {
        return request('/v1/advert/index', params, call)
    },
    /**挑战模式入场券检查 */
    ticketCheck: function(params, call) {
        return request('/v1/game/ticket-check', params, call)
    },
    /**用户信息接口 */
    info: function(params, call) {
        return request('/v1/user/info', params, call)
    },
    /**获取所有分享配置 */
    shareConfigs: function(params, call) {
        return request('/v1/share/configs', params, call)
    },
    /**展示最新通过分享获得的入场券或复活卡信息 */
    showNew: function(params, call){
        return request('/v1/share/show-new', params, call)
    }
}

function request(url, data, call){
    wx.showLoading({
        title: '加载中'
    })
    data.app_id = 'wx63c58655903676b7'
    data.version = '1.0.0'
  
    let newData = objKeySort(data);
    let pJson = JSON.stringify(newData) + '3bd5jrqgy897pf9xlpbhoc13uoitz2n0'
  
    let str = hex_md5(pJson);
    data.sign = str;

    url = "https://test.tupiaopiao.com" +url;
    wx.request({
        url: url,
        data, data,
        method: 'POST',
        success: function(res){
            wx.hideLoading();
            call(res.data)
        }
    })
}

function objKeySort(obj) {//排序的函数
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组   
      if (obj[newkey[i]] == null || obj[newkey[i]] == '' || obj[newkey[i]] == undefined) {
        continue;
      }
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
      // console.log("值："+Object.values(newObj));
    }
    return newObj;//返回排好序的新对象
}