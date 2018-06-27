cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.closePrefab();
        this.invite();
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    /**关闭prefab */
    closePrefab() {
        this.node.getChildByName('close').on(cc.Node.EventType.TOUCH_START, function(event) {
            this.node.parent = null;
        }, this)
    },
    /**邀请好友 */
    invite() {
        this.node.getChildByName('invite').on(cc.Node.EventType.TOUCH_START, function(event) {
            http.share({
                openid: wx.getStorageSync('openid'),
                type: 2
            }, result => {
                if(result.data){
                    wx.shareAppMessage({
                        title: window.shareConfigs[3].content,
                        imageUrl: window.shareConfigs[3].img,
                        query: `click_id=${result.data}&type=2`
                    })
                }else{
                    wx.showModal({
                        title: '',
                        content: '分享失败',
                        showCancel: false,
                        cancelText:'',
                        confirmText: '确定'
                    })
                }
            })
        }, this)
    }
});
