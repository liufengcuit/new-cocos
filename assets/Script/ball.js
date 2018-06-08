cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.count = 0;
        console.log('onLoad--------ball.js')
        this.effectFlag = true;
    },

    start () {

    },
    initBall: function(game) {
        this.game = game;
        console.log(game)
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
        // if(otherCollider.tag === 20002) {
        //     this._initPos = true;
        // }
        // if(otherCollider.tag === 20001){
        //     this._initPos = false;
        // }

        // //碰到篮筐
        // if(otherCollider.tag === 4000){
        //     this.ballOne = true
        // }
        // //碰到篮圈
        // if(otherCollider.tag === 4001){
        //     this.ballTwo = true
        // }

        // //碰到高弧度线
        // if(otherCollider.tag === 30000){
        //     this.ballThree = true;
        // }
    },

    //碰撞后
    onEndContact: function (contact, selfCollider, otherCollider) {
        // if(otherCollider.tag == 20001 && this._initPos){
        //     let self = this;
        //     if(this.directionMove){
        //         this.basket.moveRight(function() {
        //             self.cloneBasketMoveRight();
        //             self.initBasketEffect()
        //         });
        //     }else{
        //         this.cloneMoveRight(function() {
        //             self.basket.moveLeft()
        //             self.initBasketEffect();
        //         });
        //     }
            
           
        //     this._initPos = false;
        //     this.setPoint();
        //     this.directionMove = !this.directionMove;
        // }
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
