cc.Class({
    extends: cc.Component,
    onLoad() {
        this.backHome();
        this.prevPage();
        this.nextPage();
    },
    /**返回主场景 */
    backHome() {
        this.node.getChildByName('home').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            this.node.parent = null;
            this.node.destroy();
        }, this)
    },
    /**上一页 */
    prevPage() {
        console.log('上一页')
    },
    /**下一页 */
    nextPage() {
        console.log('下一页')
    }
});
