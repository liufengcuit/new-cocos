cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () {
        this.closePrefab();
        this.invite();
    },
    /**配置 */
    config() {
        let ticketNum;
        let node = this.node.getChildByName('ticket_big');
        if(window.ticket ==0 || window.ticket == void 0){
            ticketNum = 0;
            cc.loader.loadRes('Popup_no_ticket_.png', cc.SpriteFrame, function (err, spriteFrame) {
                node.getChildByName('ticket_num').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }else{
            ticketNum = window.ticket;
            cc.loader.loadRes('Popup_ticket_name.png', cc.SpriteFrame, function (err, spriteFrame) {
                node.getChildByName('ticket_num').getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }
        node.getChildByName('ticket_num').getComponent(cc.Label).string = ticketNum;
    },
    /**关闭prefab */
    closePrefab() {
        this.node.getChildByName('close').on(cc.Node.EventType.TOUCH_START, function(event) {
            this.node.parent = null;
        }, this)
    },
    /**邀请好友 */
    invite() {
        this.node.getChildByName('buttom_Invite ').on(cc.Node.EventType.TOUCH_START, function(event) {
            wx.shareAppMessage({
                title: '入场券分享接口',
                imageUrl: ''
            })
        }, this)
    },

    start () {

    },

    // update (dt) {},
});
