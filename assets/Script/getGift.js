let http = require('http')
cc.Class({
    extends: cc.Component,
    
    onLoad() {
        this.backHome();
        this.prevPage();
        this.nextPage();

        /**隐藏按钮 */

        this.loadLottery();

        /**页码 */
        this.pageIndex = 0;
        this.pageList = [];
    },
    /**加载公仔 */
    loadLottery() {
        let self = this;
        let list = this.node.getChildByName('list');
        http.user({
            openid: wx.getStorageSync('openid')
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
            this.pageList = a;
            console.log(this.pageList)
            if(len != 0){
                self.node.getChildByName('empty').active = false;
                list.active = true;
                this.loadGiftList()
            }
        })
    },
    /**返回主场景 */
    backHome() {
        this.node.getChildByName('home').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            this.node.parent = null;
            this.node.destroy();
            cc.director.loadScene('Home')
        }, this)
    },
    /**上一页 */
    prevPage() {
        let self = this;
        this.node.getChildByName('prev').on(cc.Node.EventType.TOUCH_START, function(event){
            if(this.pageIndex==0){
                wx.showToast({
                    title: '已经是第一页了',
                    icon:'',
                    image: '',
                    duration: 500
                })
            }else{
                this.pageIndex--;
                console.log(this.node.getChildByName('list'))
                this.node.getChildByName('list').destroyAllChildren();
                this.loadGiftList();
            }
        }, this)
    },
    /**下一页 */
    nextPage() {
        let self = this;
        this.node.getChildByName('next').on(cc.Node.EventType.TOUCH_START, function(event){
            console.log(this.pageList.length)
            console.log(this.pageIndex)
            if(this.pageIndex>= this.pageList.length -1){
                wx.showToast({
                    title: '没有了',
                    icon:'',
                    image: '',
                    duration: 500
                })
            }else{
                this.pageIndex++;
                console.log(this.node.getChildByName('list'))
                this.node.getChildByName('list').destroyAllChildren();
                this.loadGiftList()
            }
        }, this)
    },
    loadGiftList() {
        console.log(this.pageList);
        let self = this;
        for(let i=0,len = this.pageList[this.pageIndex].length;i <len; i++){
            (function(data) {
                cc.loader.loadRes("prefab/giftList", cc.Prefab, function (err, pre) {
                    let newNode = cc.instantiate(pre);
                    newNode.toysId = data.order;
                    newNode.getChildByName('listId').getComponent(cc.Label).string = data.order;
                    cc.loader.load(data.img, function (err, texture) {
                        if(texture){
                            let frame = new cc.SpriteFrame(texture);
                            newNode.getChildByName("image").getComponent(cc.Sprite).spriteFrame = frame;
                            self.node.getChildByName('list').addChild(newNode);
                        }
                    })
                })
            })(this.pageList[this.pageIndex][i])
        }
    }
});
