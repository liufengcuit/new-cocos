let http = require('http');
cc.Class({
    extends: cc.Component,

    properties: {
        fuhuocard: {
            default: null,
            type: cc.Node
        },
        cardNum:{
            default: null,
            type: cc.Label
        },
        jump:{
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Label
        }
    },

    onLoad () {
        this.useCard();
        this.loadNum();
        this.jumps();
        this.score.string = window.lastScore;
    },
    useCard() {
        this.fuhuocard.on(cc.Node.EventType.TOUCH_START, function() {
            http.useLifeCard({
                openid: wx.getStorageSync('openid')
            }, result => {
                if(result.data == -1){
                    wx.showModal({
                        title: '',
                        content: '复活卡不足',
                        showCancel: false,
                        cancelText:'',
                        confirmText: '确定'
                    })
                }else{
                    window.life_card--;
                    this.node.destroy();
                    this.node.parent.emit('say-hello', {
                        msg: 'Hello, this is Cocos Creator',
                    });
                }
            })
            
        }, this)
    },
    /**加载复活卡数量 */
    loadNum(){
        this.cardNum.string = 'x'+window.life_card;
    },
    jumps() {
        this.jump.on(cc.Node.EventType.TOUCH_START, function() {
            cc.director.loadScene('gameOver');
        }, this)
    },

    start () {

    }
});
