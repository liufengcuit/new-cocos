cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.count = 0;
        console.log('onLoad--------ball.js')
        this.effectFlag = true;
        this._initPos = false;
        this.directiveMove = true;
    },
    initBall: function(game) {
        this.game = game;
        this.initBallType();
        console.log(game)
    },
    /**初始化进球类型 */
    initBallType() {
        /**初始化碰撞球类型 
         * ballOne: '擦边球'
         * ballTwo: '空心球'
         * ballThree: '高弧度球'
        */
        this.ballOne = false;
        this.ballTwo = false;
        this.ballThree = false;
    },
    /**尾部特效 */
    ballEffect: function() {
        let node = new cc.Node();
        let contain = node.addComponent(cc.Sprite);
        contain.spriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        node.position = this.node.position;
        this.node.parent.addChild(node)
        contain.node.setContentSize(80, 80)
        node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function(){
            node.parent = null;
        })))
    },

    /**进球检测 */
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag === 1002) {
            this._initPos = false;
        }
        if(otherCollider.tag === 1003){
            this._initPos = true;
        }

        //碰到篮板
        if(otherCollider.tag === 1000){
            this.ballOne = true
        }
        //碰到篮圈
        if(otherCollider.tag === 1004){
            this.ballTwo = true
        }

        //碰到高弧度线
        if(otherCollider.tag === 30000){
            this.ballThree = true;
        }
    },

    //碰撞后
    onEndContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag == 1002 && this._initPos){

            if(this.directiveMove){
                this.game.moveDisappear(this.game.basketRight, function() {
                    this.game.moveAppear(this.game.basketLeft);
                }.bind(this));
            }else{
                this.game.moveDisappear(this.game.basketLeft, function() {
                    this.game.moveAppear(this.game.basketRight);
                }.bind(this));
            }
            this.game.directionMove = !this.game.directionMove;
            this.directiveMove = !this.directiveMove;
            this._initPos = false;
        }
    },

    update (dt) {
        this.count++;

        //判断篮球是否跳出画面
        if(this.node.getPosition().x > 375 + this.node.width/2){
            this.node.x = -375;
        }else if(this.node.getPosition().x < -375 - this.node.width/2){
            this.node.x = 375
        }

        //判断篮球是否应该添加尾巴效果
        if(this.game.effectIndex >= 2 && this.count %3 === 0 && this.effectFlag){
            this.ballEffect()
        }
    }
});
