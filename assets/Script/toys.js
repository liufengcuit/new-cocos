cc.Class({
    extends: cc.Component,
    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.backHome();
        this.creatToys();
        this.getToys();
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
        this.node.getChildByName('button01_toy').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            this.node.parent = null;
            this.node.destroy();
        }, this)
    },
    /**领取公仔 */
    getToys(){
        let self = this;
        this.node.getChildByName('button02_toy').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            cc.loader.loadRes("prefab/getGift", function (err, prefab) {
                let newNodes = cc.instantiate(prefab);
                self.node.parent.addChild(newNodes);
                self.node.parent = null;
            });
        }, this)
    }
});
