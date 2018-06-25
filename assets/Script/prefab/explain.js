cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () {
        this.node.getChildByName('confirm').on(cc.Node.EventType.TOUCH_START, function(event){
            this.node.parent = null;
        }, this)
    }
});
