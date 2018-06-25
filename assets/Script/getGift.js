let http = require('http')
cc.Class({
    extends: cc.Component,
    onLoad() {
        this.backHome();
        this.prevPage();
        this.nextPage();

        /**隐藏按钮 */

        this.loadLottery();
    },
    /**加载公仔 */
    loadLottery() {
        let self = this;
        let list = this.node.getChildByName('list');
        http.user({
            openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE'
        }, result => {
            let len = result.data.length;
            let a = [], b=[],i=0, j=0;
            result.data.forEach((element,index) => {
                if(index%4 == 0 && index != 0){
                    j++;
                    i=0;
                    b = [];
                }
                b[i] = element;
                a[j] = b;
                i++;
            });

            this.pageIndex = 0;
            this.pageList = a;
            if(len != 0){
                self.node.getChildByName('empty').active = false;
                list.active = true;
                for(let k=0, l = this.pageList[this.pageIndex].length;k <l; k++){
                    (function(data) {
                        cc.loader.loadRes("prefab/giftList", cc.Prefab, function (err, pre) {
                            let newNode = cc.instantiate(pre);
                            newNode.toysId = data.doll_id;
                            newNode.getChildByName('listId').getComponent(cc.Label).string = data.doll_id;
                            cc.loader.loadRes(data.img, cc.SpriteFrame, function (err, spriteFrame) {
                                if(spriteFrame){
                                    newNode.getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                                    list.addChild(newNode);
                                }
                            })
                        })
                    })(this.pageList[this.pageIndex][k])
                }
            }else{
                console.log('空空如也')
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
    /**上一页 */
    prevPage() {
        let self = this;
        this.node.getChildByName('prev').on(cc.Node.EventType.TOUCH_START, function(event){
            if(this.pageIndex==0 || this.pageIndex == void 0){
                wx.showToast({
                    title: '已经是第一页了',
                    icon:'',
                    image: '',
                    duration: 500
                })
            }else{
                this.pageIndex--;
                for(let i=0,len = this.pageList[this.pageIndex].length;i <len; i++){
                    (function(data) {
                        cc.loader.loadRes("prefab/giftList", cc.Prefab, function (err, pre) {
                            let newNode = cc.instantiate(pre);
                            newNode.toysId = data.doll_id;
                            newNode.getChildByName('listId').getComponent(cc.Label).string = data.doll_id;
                            cc.loader.loadRes(data.img, cc.SpriteFrame, function (err, spriteFrame) {
                                if(spriteFrame){
                                    newNode.getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                                    list.addChild(newNode);
                                }
                            })
                        })
                    })(this.pageList[this.pageIndex][i])
                }
            }
        }, this)
    },
    /**下一页 */
    nextPage() {
        let self = this;
        this.node.getChildByName('next').on(cc.Node.EventType.TOUCH_START, function(event){
            if(this.pageIndex>= this.pageList.length || this.pageIndex == void 0){
                wx.showToast({
                    title: '没有了',
                    icon:'',
                    image: '',
                    duration: 500
                })
            }else{
                console.log('下一页')
                this.pageIndex++;
                for(let i=0,len = this.pageList[this.pageIndex].length;i <len; i++){
                    (function(data) {
                        cc.loader.loadRes("prefab/giftList", cc.Prefab, function (err, pre) {
                            let newNode = cc.instantiate(pre);
                            newNode.toysId = data.doll_id;
                            newNode.getChildByName('listId').getComponent(cc.Label).string = data.doll_id;
                            cc.loader.loadRes(data.img, cc.SpriteFrame, function (err, spriteFrame) {
                                if(spriteFrame){
                                    newNode.getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                                    list.addChild(newNode);
                                }
                            })
                        })
                    })(this.pageList[this.pageIndex][i])
                }
            }
        }, this)
    }
});
