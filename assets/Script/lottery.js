let http = require('http')
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.creatImage();
        this.startGift();
        this.node.getChildByName('btns').active = false;
    },
    /**开始抽奖 */
    startGift() {
        let startBtn = this.node.getChildByName('game_box').getChildByName('start')
        startBtn.on(cc.Node.EventType.TOUCH_START, function(event){
            this.startLottery();
            /**切换按钮图片 start-lottery.png  re-select.png*/
        }, this)
    },
    /**转盘绘制图片 */
    creatImage() {
        let self = this;
        let j = 0;
        for(let i =0;i< 8;i++){
            j++;
            (function(b){let remoteUrl= window.lotteryImg['doll'+b].url;cc.loader.load(remoteUrl, function (err, texture) {
                if(texture){
                    let frame = new cc.SpriteFrame(texture);
                    self.node.getChildByName('game_box').getChildByName('node'+b).getComponent(cc.Sprite).spriteFrame = frame; 
                }
            })})(j);
        }
    },
    /**转盘转动 */
    panelMove() {
        let self = this;
        this.index = 1;
        this.speed = 5;
        this.difference = 0;
        this.no = 6;
        let border = this.node.getChildByName('game_box').getChildByName('border')
        let node = this.node.getChildByName('game_box');
        function callback() {
            self.speed += 15;
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
                    }
                })
                self.node.getChildByName('btns').active = true;
                return false;
            }
            setTimeout(callback, self.speed)
        }
        setTimeout(callback, this.speed)
    },
    /**开始摇奖 */
    startLottery() {
        http.isCanLottery({openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE'}, res=>{
            if(res.data){
                this.panelMove();
                startBtn.off(cc.Node.EventType.TOUCH_START);
                let self = this;
            }else{
                wx.showModal({
                    title: '',
                    content: '对不起，今天的摇奖次数已经用完了',
                    showCancel: false,
                    cancelText: '',
                    confirmText: '确定',
                    success:function() {
                        console.log('确定')
                    }
                })
            }
        })
    },

    start () {

    },

    // update (dt) {},
});
