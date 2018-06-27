cc.Class({
    extends: cc.Component,

    properties: {
        back_Game: {
            default: null,
            type: cc.Node
        },
        restart_Game: {
            default: null,
            type: cc.Node
        },
        life_Card: {
            default: null,
            type: cc.Node
        },
        back_Home: {
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        this.backHome();
        this.backGame();
        this.lifeCard();
        this.restartGame();
    },
    /**回到首页 */
    backHome() {
        this.back_Home.on(cc.Node.EventType.TOUCH_START, function() {
            cc.director.loadScene('Home');
        }, this)
    },
    /** 回到游戏*/
    backGame() {
        this.back_Game.on(cc.Node.EventType.TOUCH_START, function() {
            this.node.parent.emit('resume', {
                msg: 'resume'
            });
            this.node.destroy();
        }, this)
    },
    /**复活卡 */
    lifeCard() {
        let self = this;
        this.life_Card.on(cc.Node.EventType.TOUCH_START, function() {
            cc.loader.loadRes("prefab/lifeCard", cc.Prefab, function (err, pre) {
                let newNode = cc.instantiate(pre);
                newNode.width = window.game_width;
                newNode.height = window.game_height;
                newNode.position={
                    x: window.game_width/2,
                    y: window.game_height/2
                }
                self.node.parent.emit('pause', {
                    msg: 'Hello, this is Cocos Creator',
                });
            })
        }, this)
    },
    /**重玩 */
    restartGame() {
        this.restart_Game.on(cc.Node.EventType.TOUCH_START, function() {
            cc.director.loadScene('Game')
        }, this)
    }
});
