var Ball = require('ball')
var Score = require('score')
cc.Class({
    extends: cc.Component,

    properties: {
        ball: Ball,
        _score: Score
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /**开启物理组件碰撞系统 */
        cc.director.getPhysicsManager().enabled = true;

        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.basketball = this.node.getChildByName('basketball')
            this.bodyJump = this.basketball.getComponent(cc.RigidBody);
            // 设置移动速度
            if(this.directionMove){
                this.bodyJump.linearVelocity = cc.v2(250,1500);
            }else{
                this.bodyJump.linearVelocity = cc.v2(-250, 1500)
            }

            this._score.setScore(2)
        }, this)

        this.init();
    },

    init: function() {
        console.log(this.score)
        this.basketRight = this.node.getChildByName('basket')
        this.basketLeft = this.node.getChildByName('basket-copy')

        this.effectIndex = 0;
        this.score = 0;
        this.directionMove = true;
        this.ball.initBall(this);
        this._score.initScore(this);
        this.initBasketPos()
    },


    //初始化篮筐位置
    initBasketPos: function() {
        this.basketLeft.x = -800;
        this.basketRight.x = 800;
        this.node.getChildByName("effect-copy").x = -800+91;
        this.node.getChildByName("effect").x = 800 - 91
        this.moveAppear(this.basketRight)
    },

    /**篮筐出现动画 */
    moveAppear: function(node) {
        let visibleSize = cc.view.getVisibleSize();

        //设置Y的坐标位置
        let calcOperation = [1, -1];
        /**设置运动方向 */
        let moveDirection = node.name === 'basket'? 1: -1;

        /**篮网节点 */
        let effect = node.name === 'basket'? this.node.getChildByName("effect"): this.node.getChildByName("effect-copy")
        node.x = moveDirection * (visibleSize.width/2 + 150)
        
        node.y = calcOperation[Math.floor(Math.random()*2)] * parseInt(Math.random()*visibleSize.height / 4)

        let moveLeft = cc.moveBy(0.3, cc.p(-150 * moveDirection - moveDirection * node.width/2, 0)).easing(cc.easeOut(1.0))


        //设置篮网位置
        effect.position = {
            x: node.x - 91* moveDirection,
            y: node.y - 96
        }

        let move = cc.moveBy(0.3, cc.p(moveDirection * (-150-node.width/2), 0)).easing(cc.easeOut(1.0))
        effect.runAction(cc.sequence(move, cc.callFunc(function() {
            // self.creatEffect();
            // wx.hideLoading();
        })))
        
        node.runAction(moveLeft);
    },

    /**篮筐退出动画 */
    moveDisappear: function(node, call) {
        let moveDirection = node.name === 'basket'? 1: -1;
        let moveLeft = cc.moveBy(0.3, cc.p(moveDirection*250, 0)).easing(cc.easeOut(1.0))
        let move = cc.moveBy(0.3, cc.p(moveDirection*250, 0)).easing(cc.easeOut(1.0))

        let effect = node.name === 'basket'? this.node.getChildByName("effect"): this.node.getChildByName("effect-copy")
        effect.runAction(moveLeft)

        node.runAction(cc.sequence(move, cc.callFunc(function() {
            call();
        })));
    }
});