let http = require('http');
cc.Class({
    extends: cc.Component,
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadBg();
        this.backHome();
        this.creatToys();
        this.getToys();
    },
    /**加载背景图 */
    loadBg() {
        let bg = this.node.getChildByName('toysBg');
        wx.showLoading({title: '加载中',mask: true})
        cc.loader.load("https://miniapp.tupiaopiao.com/public/image/toysBg.png", function (err, texture) {
            if(texture){
                let frame = new cc.SpriteFrame(texture);
                bg.getComponent(cc.Sprite).spriteFrame = frame;
                wx.hideLoading();
            }
        })
    },

    /**返回主场景 */
    backHome() {
        this.node.getChildByName('home').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            this.node.parent = null;
            this.node.destroy();
        }, this)
    },

    /**合成公仔 */
    creatToys() {
        let resultMsg = ['系统错误', '合成成功', '普通娃娃数量不足', '合成失败']
        this.node.getChildByName('button01_toy').on(cc.Node.EventType.TOUCH_START, function(event){
            wx.showModal({
                title: '',
                content: '确定要合成超级公仔么？',
                cancelText:'取消',
                confirmText: '确定',
                success: function(confirm) {
                    if(confirm.confirm){
                        //销毁当前节点
                        http.compose({
                            openid: wx.getStorageSync('openid')
                        }, result => {
                            wx.showModal({
                                title: '',
                                content: resultMsg[result.data],
                                showCancel: false,
                                cancelText:'',
                                confirmText: '确定'
                            })
                        })
                    }
                }
            })
        }, this)
    },
    /**领取公仔 */
    getToys(){
        let self = this;
        this.node.getChildByName('button02_toy').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            cc.loader.loadRes("prefab/getGift", function (err, prefab) {
                let newNodes = cc.instantiate(prefab);
                newNodes.width = window.game_width;
                newNodes.height = window.game_height;
                newNodes.position={
                    x: 0,
                    y: 0
                }
                self.node.parent.addChild(newNodes);
                self.node.parent = null;
            });
        }, this)
    }
});
