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

        /**隐藏按钮 */
        this.node.getChildByName('buttons').active = false;
        this.node.getChildByName('un_open').active = false;

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
                            })
                        }else{
                            return false;
                        }
                        console.log(res)
                    })
                }else{
                    self.reActiveNode()
                    self.baseInfo();
                }
            }
        })
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
    /**获取用户信息，并坚持是否开启了挑战模式 */
    baseInfo() {
        http.info({
            openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE'
        }, result=> {
            if(result.data.is_start_challenge){
                let self = this;
                let buttons = this.node.getChildByName('un_open').getChildByName('buttons');
                cc.loader.loadRes("challenge2.png", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getChildByName('buttons').getChildByName('challenge').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    buttons.active = true;
                    buttons.getChildByName('ticket').getChildByName('recard').getComponent(cc.Label).string = '入场券x'+result.data.ticket;
                    buttons.getChildByName('card').getChildByName('recard').getComponent(cc.Label).string = '复活卡x'+result.data.life_card;

                });
            }else{
                wx.showModal({
                    title: '',
                    content: '暂时未开通',
                    showCancel: false,
                    cancelText:'',
                    confirmText: '确定'
                })
            }
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
            http.ticketCheck({
                openid: "o7Ocn47Jx_OO0UX0taxAEND4IZGE"
            }, result => {
                if(result.data.result){
                    window.gameMode = 1;
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
            
        }, this)
    },
    /**检查今天是否还能继续挑战 */
    isNextChallenge() {
        http.challengeCheck({
            openid: 'o7Ocn47Jx_OO0UX0taxAEND4IZGE'
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
    reActiveNode(){
        //隐藏开始按钮
        this.node.getChildByName('buttons').active = true;
        //隐藏复活卡
        this.node.getChildByName('un_open').active = true;
        /**隐藏入场券复活卡按钮 */
        this.node.getChildByName('un_open').getChildByName('buttons').active = false;
    },
    start () {

    }
});
