cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

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
                            height: 55 * height / 667,
                            lineHeight: 40,
                            backgroundColor: '#ff0000',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4,
                            alpha: 0
                        }
                    })
                    button.onTap((res) => {
                        if(res.userInfo){
                            _wx.login(res,(result) => {
                                self.reActiveNode()
                                button.destroy();
                            })
                        }else{
                            return false;
                        }
                        console.log(res)
                    })
                }else{
                    self.reActiveNode()
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
    /**开始游戏 */
    startGame() {
        this.node.getChildByName('buttons').getChildByName('startgame').on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('Game')
        }, this)
    },
    reActiveNode(){
        //隐藏开始按钮
        this.node.getChildByName('buttons').active = true;
        //隐藏复活卡
        this.node.getChildByName('un_open').active = true;
    },
    start () {

    }
});
