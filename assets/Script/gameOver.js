let http = require('http');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /**为普通模式时候 */
        let challenge = this.node.getChildByName('challenge');
        challenge.getChildByName('score').getComponent(cc.Label).string = window.lastScore;
        if(window.gameMode == 2){
            challenge.getChildByName('success').opacity = 0;
            challenge.getChildByName('tips').opacity = 0;
            challenge.getChildByName('goal').opacity = 0;
        }else{
            /**完成目标没有机会抽取时 */
            if(window.lastScore - window.goalScore >=0){
                challenge.getChildByName('goal').getComponent(cc.Label).string = '距离挑战目标还差\n'+(window.goalScore-window.lastScore)
                challenge.getChildByName('success').opacity = 0;
            }
            /**完成目标可以抽取时 */
            else{
                challenge.getChildByName('title').opacity = 0;
                challenge.getChildByName('chose_toy_button').opacity = 255;
                challenge.getChildByName('tips').opacity = 0;
                this.node.getChildByName('btns').active = false;
                this.node.getChildByName('btns').opacity = 0;
            }
        }

        this.node.getChildByName('moregame').active = false;

        this.backHome();
        this.againChallenge();
        this.invite();
        this.reliveCard();
        this.moreGame();
        this.extractGift();


        this.loadZhuanPan();
    },
    /**回到首页 */
    backHome() {
        this.node.getChildByName('home').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('Home');
        })
    },
    /**再次挑战 */
    againChallenge() {
        this.node.getChildByName('btns').getChildByName('button02').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('Game');
        })
    },
    /**邀请好友 */
    invite() {
        this.node.getChildByName('btns').getChildByName('button03').on(cc.Node.EventType.TOUCH_START, function(event){
            console.log('邀请好友')
        })
    },
    /**复活卡 */
    reliveCard() {
        this.node.getChildByName('btns').getChildByName('card_relive').on(cc.Node.EventType.TOUCH_START, function(event){
            console.log('复活卡')
        })
    },
    /**更多游戏 */
    moreGame() {
        this.node.getChildByName('moregame').on(cc.Node.EventType.TOUCH_START, function(event){
            console.log('更多游戏')
        })
    },
    /**抽取公仔 */
    extractGift() {
        // cc.loader.loadRes("prefab/lottery", cc.Prefab, function (err, pre) {
        //     var newNode = cc.instantiate(pre);
        //     newNode.width = window.game_width;
        //     newNode.height = window.game_height;
        //     newNode.position={
        //         x: window.game_width/2,
        //         y: window.game_height/2
        //     }
        //     cc.director.getScene().addChild(newNode);
        // })
        this.node.getChildByName('challenge').getChildByName('chose_toy_button').on(cc.Node.EventType.TOUCH_START, function(event){
            console.log('抽取公仔')
            cc.loader.loadRes("prefab/lottery", cc.Prefab, function (err, pre) {
                let newNode = cc.instantiate(pre);
                newNode.width = window.game_width;
                newNode.height = window.game_height;
                newNode.position={
                    x: window.game_width/2,
                    y: window.game_height/2
                }
                cc.director.getScene().addChild(newNode);
            })
        })
    },
    /**广告 */
    ad() {
        let self = this;
        http.ad({
            position: 2
        }, result => {
            if(!result.data){
                return false;
            }
            this.node.getChildByName('moregame').active = true
            self.previewAdCode = result.data;
            /**获取成功过后才绑定广告预览事件 */
            self.previewAd();
            cc.loader.load(result.data.ad_img, function (err, texture) {
                if(texture){
                    let frame = new cc.SpriteFrame(texture);
                    self.node.getChildByName('moregame').getComponent(cc.Sprite).spriteFrame = frame; 
                }
            })
        })
    },
    /**广告预览 */
    previewAd() {
        let self = this;
        this.node.getChildByName('moregame').on(cc.Node.EventType.TOUCH_START, function(event){
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.previewImage({
                urls: [self.previewAdCode.qr_img],
                complete: function() {
                    wx.hideLoading();
                }
            })
            
        }, this)
        
    },
    /**加载抽奖转盘图片 */
    loadZhuanPan() {
        let self = this;
        let resultConfig = ['系统异常','挑战成功', '挑战成功不摇奖', '挑战失败', '进入挑战模式', '普通模式正常结束']
        http.point({openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE',point: window.lastScore, mode: window.gameMode}, res => {
            console.log(res)
            
            if(window.gameMode == 2){
                self.node.getChildByName('challenge').getChildByName('goal').opacity = 255;
                self.node.getChildByName('challenge').getChildByName('goal').getComponent(cc.Label).string = '本周最佳：'+res.data.weekbest
            }else if(res.data.result == 1){
                window.lotteryImg = res.data.lottery_config.options;
                window.log_id = res.data.lottery_config.log_id;
                window.reelect_time = res.data.lottery_config.reelect_time
            }else{
                wx.showModal({
                    title: '',
                    content: resultConfig[res.data.result],
                    showCancel: false,
                    cancelText:'',
                    confirmText: '确定'
                })
            }
        })
    }


    // update (dt) {},
});
