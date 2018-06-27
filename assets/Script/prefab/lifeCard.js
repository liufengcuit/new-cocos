cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () {
        this.closePage();
        this.setNum();
        this.invite();
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    /**关闭当前页面 */
    closePage() {
        this.node.getChildByName('close').on(cc.Node.EventType.TOUCH_START, function() {
            this.node.parent = null;
        }, this)
    },
    /**设置复活卡数量 */
    setNum() {
        this.node.getChildByName('lifeCard').getChildByName('cardNum').getComponent(cc.Label).string = 'x'+ window.life_card;
    },
    /**邀请好友 */
    invite() {
        this.node.getChildByName('invite').on(cc.Node.EventType.TOUCH_START, function() {
            wx.shareAppMessage({
                title: '复活卡',
                imageUrl: ''
            })
        }, this)
    }
});
