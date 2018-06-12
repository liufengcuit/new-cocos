cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadLottery();
        this.startGame();

        this.countAd = 0;
    },

    /*加载我的公仔页面 */
    loadLottery() {
        this.node.getChildByName('doll').on(cc.Node.EventType.TOUCH_START, function(event){
            // 加载 Prefab
            let self = this;
            cc.loader.loadRes("prefab/toys", function (err, prefab) {
                var newNode = cc.instantiate(prefab);
                self.node.addChild(newNode);
            });
        }, this)
    },
    /**开始游戏 */
    startGame() {
        this.node.getChildByName('buttons').getChildByName('startgame').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('Game')
        }, this)
    },
    start () {

    },
    adMove() {
        let left = cc.rotateBy(0.15, 30).easing(cc.easeCubicActionOut());
        let orign = cc.rotateBy(0.1, 0).easing(cc.easeCubicActionOut());
        let right = cc.rotateBy(0.15, -30).easing(cc.easeCubicActionOut());
        return this.node.getChildByName('moregame').runAction(cc.sequence(left, orign, right, orign, left, orign, right, orign));
    },

    update(dt) {
        this.countAd++;
        if(this.countAd == 300){
            this.adMove();
            this.countAd = 0;
        }
    }

});
