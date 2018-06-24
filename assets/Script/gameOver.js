let http = require('http');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let visibleSize = cc.director.getVisibleSize();
        window.game_height = visibleSize.height;
        window.game_width = visibleSize.width;
        window.goalScore = 2100;
        /**为普通模式时候 */
        let challenge = this.node.getChildByName('challenge');
        if(false){
            challenge.getChildByName('success').opacity = 0;
            challenge.getChildByName('tips').opacity = 0;
            challenge.getChildByName('goal').opacity = 0;
        }else{
            /**完成目标没有机会抽取时 */
            if(/*window.lastScore - window.goalScore*/10 <=0){
                challenge.getChildByName('title').opacity = 0;
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

    start () {
        
    },
    /**加载抽奖转盘图片 */
    loadZhuanPan() {
        http.point({openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE',point: 1200, mode: 1}, res => {
            console.log(res)
            window.lotteryImg = res.data.lottery_config.options;
        })
    }


    // update (dt) {},
});
