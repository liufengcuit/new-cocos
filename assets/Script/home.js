let http = require('http');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.loadLottery();
        this.startGame();

        let visibleSize = cc.director.getVisibleSize();
        window.game_height = visibleSize.height;
        window.game_width = visibleSize.width;
        let self = this;
        this.isChallenge = false;

        /**隐藏按钮 */
        this.node.getChildByName('buttons').active = false;
        this.node.getChildByName('un_open').active = false;
        /**加载广告位 */
        // this.node.getChildByName('moregame').active = false;
        this.ad();

        wx.getSetting({
            success: function(res){
                if(!res.authSetting['scope.userInfo']){
                    //创建微信授权按钮
                    let width = wx.getSystemInfoSync().windowWidth;
                    let height = wx.getSystemInfoSync().windowHeight;

                    let button = wx.createUserInfoButton({
                        type: "image",
                        image: 'res/raw-assets/resources/start.png',
                        text: "获取用户信息",
                        style: {
                            left: 48 * width / 375,
                            top: 429 * height / 667,
                            width: 275 * width / 375,
                            height: 55 * height / 667
                        }
                    })
                    button.onTap((res) => {
                        if(res.userInfo){
                            _wx.login(res,(result) => {
                                self.reActiveNode()
                                button.destroy();
                                self.baseInfo();
                                self.checkNewTips();
                            })
                        }else{
                            return false;
                        }
                    })
                }else{
                    if(wx.getStorageSync('openid')){
                        self.reActiveNode()
                        self.baseInfo();
                        self.checkNewTips();
                    }else{
                        wx.login({
                            success: function (res) {
                                console.log(res)
                                http.session({
                                    openid:'o7Ocn47Jx_OO0UX0taxAEND4IZGE',
                                    wxCode: res.code
                                }, function(result){
                                    wx.setStorageSync('openid', "o7Ocn47Jx_OO0UX0taxAEND4IZGE")
                                    self.checkNewTips();
                                    self.reActiveNode()
                                    self.baseInfo();
                                })
                            }
                        })
                    }
                    
                }
            }
        })

        this.shareConfigs();
        /**开启微信分享 */
        wx.showShareMenu({
            withShareTicket: true
        })

        this.wxConfig();
        this.playBgMusic();
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
    /**获取用户信息，并检查是否开启了挑战模式 */
    baseInfo() {
        http.info({
            openid: wx.getStorageSync('openid')
        }, result=> {
            this.node.getChildByName('open').active = false;
            this.config();
            if(result.data.is_start_challenge){
                let self = this;
                let buttons = this.node.getChildByName('un_open').getChildByName('buttons');
                this.isChallenge = true;
                cc.loader.loadRes("challenge2.png", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getChildByName('buttons').getChildByName('challenge').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    buttons.active = true;
                    self.node.getChildByName('un_open').opacity = 255;
                    //设置入场券数量和复活卡数量
                    window.ticket = result.data.ticket;
                    window.life_card = result.data.life_card;

                    buttons.getChildByName('ticket').getChildByName('recard').getComponent(cc.Label).string = '入场券x'+result.data.ticket;
                    buttons.getChildByName('card').getChildByName('recard').getComponent(cc.Label).string = '复活卡x'+result.data.life_card;
                });

                
                this.ticket();
                this.lifeCard();
                this.explain();
            }else{
                this.isChallenge = false;
                this.node.getChildByName('open').active = true;
                this.node.getChildByName('open').opacity = 255;
                this.node.getChildByName('un_open').opacity = 0;
                // wx.showModal({
                //     title: '',
                //     content: '暂时未开通',
                //     showCancel: false,
                //     cancelText:'',
                //     confirmText: '确定'
                // })
            }
            this.startChallengeGame();
        })
    },
    /**开始普通游戏模式 */
    startGame() {
        this.node.getChildByName('buttons').getChildByName('startgame').on(cc.Node.EventType.TOUCH_START, function(event){
            window.gameMode = 2;
            cc.director.loadScene('Game')
        }, this)
    },
    /**开始挑战游戏模式 */
    startChallengeGame() {
        this.node.getChildByName('buttons').getChildByName('challenge').on(cc.Node.EventType.TOUCH_START, function(event){
            if(this.isChallenge){
                http.ticketCheck({
                    openid: wx.getStorageSync('openid')
                }, result => {
                    if(result.data.result){
                        window.gameMode = 1;
                        window.use_lifeCard_num = result.data.use_num;
                        cc.director.loadScene('Game')
                    }else{
                        wx.showModal({
                            title: '',
                            content: '入场券不够了',
                            showCancel: false,
                            cancelText:'',
                            confirmText: '确定'
                        })
                    }
                })
            }else{
                wx.showModal({
                    title: '',
                    content: `游戏中达到${window.challenge_start_point?window.challenge_start_point:200}分后即可开启挑战模式`,
                    showCancel: false,
                    cancelText:'',
                    confirmText: '确定'
                })
                console.log('ewrwr')
            }
            
            
        }, this)
    },
    /**相关配置 */
    config() {
        http.config({}, result=> {
            if(result.data){
                window.goalScore = result.data.challenge_point;
                window.challenge_start_point = result.data.challenge_start_point
                this.node.getChildByName('un_open').getChildByName('score').getComponent(cc.Label).string = result.data.challenge_point;
            }
        })
    },
    /**检查今天是否还能继续挑战 */
    isNextChallenge() {
        http.challengeCheck({
            openid: wx.getStorageSync('openid')
        }, result => {
            if(result.data.result){
                console.log('继续游戏')
            }else{
                wx.showModal({
                    title: '',
                    content: '今天的挑战次数已经用完了',
                    showCancel: false,
                    cancelText:'',
                    confirmText: '确定'
                })
            }
        })
    },
    /**广告 */
    ad() {
        let self = this;
        http.ad({
            position: 1
        }, result => {
            if(!result.data){
                return false;
            }
            self.node.getChildByName('moregame').active = true
            self.previewAdCode = result.data;
            console.log(result.data.ad_img)
            cc.loader.load(result.data.ad_img, function (err, text) {
                if(text){
                    let frame = new cc.SpriteFrame(text);
                    self.node.getChildByName('moregame').getComponent(cc.Sprite).spriteFrame = frame;
                    /**获取成功过后才绑定广告预览事件 */
                    self.previewAd();
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
    /**入场券按钮 */
    ticket() {
        this.node.getChildByName('un_open').getChildByName('buttons').getChildByName('ticket').getChildByName('recard').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.loader.loadRes("prefab/dialogBox", cc.Prefab, function (err, pre) {
                let newNode = cc.instantiate(pre);
                newNode.width = window.game_width;
                newNode.height = window.game_height;
                newNode.position={
                    x: window.game_width/2,
                    y: window.game_height/2
                }
                cc.director.getScene().addChild(newNode);
            })
            
        }, this)
    },
    /**复活卡按钮 */
    lifeCard() {
        this.node.getChildByName('un_open').getChildByName('buttons').getChildByName('card').getChildByName('recard').on(cc.Node.EventType.TOUCH_START, function(event){
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
        }, this)
    },
    /**说明事件 */
    explain() {
        this.node.getChildByName('un_open').getChildByName('helpbox').getChildByName('help').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.loader.loadRes("prefab/explain", cc.Prefab, function (err, pre) {
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
    /**检查是否有新的入场券或者复活卡 */
    checkNewTips() {
        if(!wx.getStorageSync('openid')){
            return false;
        }
        http.showNew({
            openid: wx.getStorageSync('openid')
        }, result => {
            console.log(result)
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
    },
    reActiveNode(){
        //隐藏开始按钮
        this.node.getChildByName('buttons').active = true;
        //隐藏复活卡
        this.node.getChildByName('un_open').active = true;
        /**隐藏入场券复活卡按钮 */
        this.node.getChildByName('un_open').getChildByName('buttons').active = false;
    },
    /**获取所有分享配置 */
    shareConfigs() {
        let self = this;
        /**1.默认分享转发 2.首页/群排行-挑战 3.复活卡弹窗邀请好友 4.首页/好友排行-群排行 5.结束页-邀请好友挑战 6.转盘页-炫耀 7.转盘页重选 8.入场券回赠 9复活卡回赠 */
        http.shareConfigs({}, result => {
            if(result.data){
                window.shareConfigs = result.data;
                self.defaultShare();
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
                console.log(res.query)
                console.log(res)
            }
            console.log(res)
            self.checkNewTips();
        })
    },
    playBgMusic() {
        this.audio = wx.createInnerAudioContext();
        this.audio.src = "res/raw-assets/resources/audio/bg.mp3"

        this.audio.loop = true;
        wx.onShow(function () {
            this.audio.play()
            // this.checkNewTips();
        }.bind(this))
        wx.onHide(function() {
            this.audio.pause();
        }.bind(this))
        this.audio.play()
    },
    onDestroy() {
        this.audio.stop();
    }
});
