cc.Class({
    extends: cc.Component,
    onLoad () {
        this.node.getChildByName('button_try').on(cc.Node.EventType.TOUCH_START, function(event){
            window.gameMode = 1;
            cc.director.loadScene('Game')
        })
    }
});
