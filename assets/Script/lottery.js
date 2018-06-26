let http = require('http')
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.creatImage();
        this.startGift();
        this.node.getChildByName('btns').active = false;
        this.repeatLottery = true;
    },
    /**开始抽奖 */
    startGift() {
        let startBtn = this.node.getChildByName('game_box').getChildByName('start');
        let self = this;
        startBtn.on(cc.Node.EventType.TOUCH_START, function(event){
            console.log(window.reelect_time);
            if(!this.repeatLottery){
                if(window.reelect_time <=0){
                    wx.showModal({
                        title: '',
                        content: '已经没有抽奖次数了',
                        showCancel: false,
                        cancelText:'',
                        confirmText: '确定',
                        success: function(res){
                            startBtn.opacity = 0;
                            startBtn.off(cc.Node.EventType.TOUCH_START)
                        }
                    })
                }else{
                    wx.showModal({
                        title: '',
                        content: '邀请好友来帮你重选一次吧',
                        showCancel: false,
                        cancelText:'',
                        confirmText: '好的',
                        success: function(res) {
                            if(res.confirm){
                                cc.loader.loadRes('start-lottery.png', cc.SpriteFrame, function (err, spriteFrame) {
                                    if(spriteFrame){
                                        startBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                                        self.node.getChildByName('getGiftTips').opacity = 0;
                                        self.node.getChildByName('tips').opacity = 255;
                                        self.repeatLottery = true;

                                        wx.shareAppMessage({
                                            title: '邀请好友帮忙重选',
                                            imageUrl: ''
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
                return false;
            }
            /**判断是否还能继续 */
            if(window.reelect_time >0){
                this.lottery();
                window.reelect_time --;
            }else{
                this.node.getChildByName('game_box').getChildByName('start').opacity = 0;
                return false;
            }
            /**切换按钮图片 start-lottery.png  re-select.png*/
        }, this)
    },
    /**转盘绘制图片 */
    creatImage() {
        let self = this;
        let j = 0;
        for(let i =0;i< 8;i++){
            j++;
            (function(b){
                let remoteUrl= window.lotteryImg['doll'+b].url;
                cc.loader.load(remoteUrl, function (err, texture) {
                    if(texture){
                        let frame = new cc.SpriteFrame(texture);
                        self.node.getChildByName('game_box').getChildByName('node'+b).getComponent(cc.Sprite).spriteFrame = frame; 
                    }
                })
            })(j);
        }
    },
    /**转盘转动 */
    panelMove() {
        let self = this;
        this.index = 1;
        this.speed = 5;
        this.difference = 0;
        let border = this.node.getChildByName('game_box').getChildByName('border')
        let node = this.node.getChildByName('game_box');
        function callback() {
            self.speed += 10;
            if(self.speed > 450){
                self.difference = self.index-self.no>0? self.index-self.no: 8-self.index + self.no
            }
            border.position = node.getChildByName('node'+ self.index).position;
            self.index++;
            if(self.index > 8){
                self.index = 1;
            }
            self.difference--;
            if(self.difference==0){
                self.startGift();
                cc.loader.loadRes('re-select.png', cc.SpriteFrame, function (err, spriteFrame) {
                    if(spriteFrame){
                        let startBtn = self.node.getChildByName('game_box').getChildByName('start')
                        startBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        self.node.getChildByName('getGiftTips').opacity = 255;
                        self.node.getChildByName('tips').opacity = 0;
                        self.node.getChildByName('getGiftTips').getChildByName('content').getComponent(cc.Label).string = '恭喜获得'+ self.toysName;
                        self.repeatLottery = false;

                        self.getToys();
                    }
                })
                self.node.getChildByName('btns').active = true;
                return false;
            }
            setTimeout(callback, self.speed)
        }
        setTimeout(callback, this.speed)
    },
    /**开始摇奖并获取ID */
    lottery(){
        let startBtn = this.node.getChildByName('game_box').getChildByName('start')
        let resultConfig = ['系统错误', '成功', '次数超限', '没有挑战记录', '挑战和摇奖不是同一个用户', '挑战没有成功', '重摇次数超限']
        http.lottery({
            openid: wx.getStorageSync('openid'),
            log_id: window.log_id
        }, result => {
            if(result.data.result == 1){
                this.toysName = window.lotteryImg[result.data.doll_key].name;
                this.no = result.data.doll_key.replace(/[^0-9]/ig, "");
                this.panelMove();
                startBtn.off(cc.Node.EventType.TOUCH_START);
            }else{
                wx.showModal({
                    title: '',
                    content: resultConfig[result.data.result],
                    showCancel: false,
                    cancelText:'',
                    confirmText: '确定'
                })
            }
        })
    },
    /**领取公仔 */
    getToys(){
        let self = this;
        this.node.getChildByName('btns').getChildByName('botton02_game').on(cc.Node.EventType.TOUCH_START, function(event){
            //销毁当前节点
            cc.loader.loadRes("prefab/getGift", function (err, prefab) {
                let newNodes = cc.instantiate(prefab);
                newNodes.width = window.game_width;
                newNodes.height = window.game_height;
                newNodes.position={
                    x: window.game_width/2,
                    y: window.game_height/2
                }
                self.node.parent.addChild(newNodes);
                self.node.parent = null;
            });
        }, this)
    }
});
