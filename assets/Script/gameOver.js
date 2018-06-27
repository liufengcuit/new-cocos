let http = require('http');
cc.Class({
    extends: cc.Component,

    properties: {
    },

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
            if(window.lastScore - window.goalScore < 0){
                challenge.getChildByName('goal').getComponent(cc.Label).string = '距离挑战目标还差\n'+(window.goalScore-window.lastScore)
                challenge.getChildByName('success').opacity = 0;
                challenge.getChildByName('tips').opacity = 0;
            }
            /**完成目标可以抽取时 */
            else{
                challenge.getChildByName('goal').getComponent(cc.Label).string = '挑战目标：'+(window.goalScore)
                http.isCanLottery({
                    openid: wx.getStorageSync('openid')
                }, result => {
                    /**能继续抽奖 */
                    if(result.data){
                        challenge.getChildByName('title').opacity = 0;
                        challenge.getChildByName('chose_toy_button').opacity = 255;
                        this.node.getChildByName('btns').active = false;
                        this.node.getChildByName('btns').opacity = 0;
                        this.extractGift();
                    }else{
                        /**不能参与摇奖 */
                        challenge.getChildByName('title').opacity = 0;
                        challenge.getChildByName('tips').opacity = 255;
                    }
                })
                
            }
        }

        this.node.getChildByName('moregame').active = false;

        this.backHome();
        this.againChallenge();
        this.invite();
        this.reliveCard();
        this.loadZhuanPan();
        wx.showShareMenu({
            withShareTicket: true
        })

        this.defaultShare();
        this.wxConfig();
        this.checkNewTips();
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
            if(window.gameMode == 2){
                cc.director.loadScene('Game');
            }else{
                http.challengeCheck({
                    openid: wx.getStorageSync('openid')
                }, result => {
                    if(result.data.result){
                        cc.director.loadScene('Game');
                    }else{
                        wx.showModal({
                            title: '',
                            content: "今天的挑战次数已经用完了",
                            showCancel: false,
                            cancelText:'',
                            confirmText: '确定'
                        })
                    }
                })
            }
            
        })
    },
    /**邀请好友 */
    invite() {
        this.node.getChildByName('btns').getChildByName('button03').on(cc.Node.EventType.TOUCH_START, function(event){
            wx.shareAppMessage({
                title: window.shareConfigs[1].content,
                imageUrl: window.shareConfigs[1].img
            })
        })
    },
    /**复活卡 */
    reliveCard() {
        this.node.getChildByName('btns').getChildByName('card_relive').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.loader.loadRes("prefab/lifeCard", cc.Prefab, function (err, pre) {
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
    /**抽取公仔 */
    extractGift() {
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
        http.point({openid: wx.getStorageSync('openid'),point: window.lastScore, mode: window.gameMode}, res => {
            console.log(res)
            
            if(window.gameMode == 2){
                self.node.getChildByName('challenge').getChildByName('goal').opacity = 255;
                self.node.getChildByName('challenge').getChildByName('goal').getComponent(cc.Label).string = '本周最佳：'+(res.data.weekbest?res.data.weekbest:0)
            }else if(res.data.result == 1){
                window.lotteryImg = res.data.lottery_config.options;
                window.log_id = res.data.lottery_config.log_id;
                window.reelect_time = res.data.lottery_config.reelect_time
            }else{
                console.log('挑战失败')
            }

            if(res.data.result == 4){
                /**进入挑战模式 */
                cc.loader.loadRes("prefab/openChallenge", cc.Prefab, function (err, pre) {
                    let newNode = cc.instantiate(pre);
                    newNode.width = window.game_width;
                    newNode.height = window.game_height;
                    newNode.position={
                        x: window.game_width/2,
                        y: window.game_height/2
                    }
                    cc.director.getScene().addChild(newNode);
                })
            }
        })
    },
    /**默认分享弹窗 */
    defaultShare() {
        wx.onShareAppMessage(() =>{
            return {
                title: window.shareConfigs[1].content,
                imageUrl: window.shareConfigs[1].img
            }
        })
    },
    wxConfig() {
        let self = this;
        wx.onShow(function(res) {
            if(res.query){
                // 复活卡
                if(res.query.type == 2){
                    http.inviteBack({
                        click_id: res.query.clickId,
                        openid: wx.getStorageSync('openid')
                    }, result=>{})
                }
                if(res.query.type == 3){
                    http.inviteTicket({
                        click_id: res.query.clickId,
                        openid: wx.getStorageSync('openid')
                    }, result=>{})
                }
            }
        })
    },
    /**检查是否有新的入场券或者复活卡 */
    checkNewTips() {
        http.showNew({
            openid: wx.getStorageSync('openid')
        }, result => {
            console.log(result.data)
            if(!result.data){
                return false;
            }
            if(result.data.ticket){
                cc.loader.loadRes("prefab/dialogNew", cc.Prefab, function (err, pre) {
                    let newNode = cc.instantiate(pre);
                    newNode.width = window.game_width;
                    newNode.height = window.game_height;
                    newNode.position={
                        x: window.game_width/2,
                        y: window.game_height/2
                    }
                    cc.loader.load(result.data.ticket.avatar, function (err, texture) {
                        if(texture){
                            let frame = new cc.SpriteFrame(texture);
                            newNode.getChildByName('headport').getComponent(cc.Sprite).spriteFrame = frame; 
                            newNode.getChildByName('headport').getChildByName('username').getComponent(cc.Label).string = result.data.ticket.nickname;
                            cc.director.getScene().addChild(newNode);
                        }
                    })
                }) 
            }
            if(result.data.life_card){
                cc.loader.loadRes("prefab/dialogNew", cc.Prefab, function (err, pre) {
                    let newNode = cc.instantiate(pre);
                    newNode.width = window.game_width;
                    newNode.height = window.game_height;
                    newNode.position={
                        x: window.game_width/2,
                        y: window.game_height/2
                    }
                    cc.loader.load(result.data.life_card.avatar, function (err, texture) {
                        if(texture){
                            let frame = new cc.SpriteFrame(texture);
                            newNode.getChildByName('headport').getComponent(cc.Sprite).spriteFrame = frame; 
                            newNode.getChildByName('headport').getChildByName('username').getComponent(cc.Label).string = result.data.life_card.nickname;
                            cc.director.getScene().addChild(newNode);
                        }
                    })
                }) 
            }
        })
    }
});
