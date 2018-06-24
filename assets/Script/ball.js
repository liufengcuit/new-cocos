let Progress = require('time')
cc.Class({
    extends: cc.Component,

    properties: {
        progress: Progress
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.count = 0;
        this.effectFlag = true;
        this._initPos = false;
        this.directiveMove = true;
        this.ballTypeNum = 0;
        /**关卡 */
        this.level = 1;
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

        this.ballTypeNum = 0;
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
        if(otherCollider.tag === 1001){
            this.ballTwo = true
        }
        //碰到高弧度线
        if(otherCollider.tag === 1004){
            this.ballThree = true;
        }
    },

    //碰撞后
    onEndContact: function (contact, selfCollider, otherCollider) {
        /**进球判断 */
        if(otherCollider.tag == 1002 && this._initPos){
            this._initPos = false;
            this.level++;

            if(this.game.isProgressEnd() <= 0){
                this.ballTypeNum = 4;
            }
            this.progress.countTime(this.level, ()=>{
                this.game.isClick = true;
            })
            this.ballType()
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
            this.ballEffect();
        }
    },
    /** 进球类型*/
    ballType() {
        let node = new cc.Node('ballType');
        let sp = node.addComponent(cc.Sprite)
        let self = this;

        if(!this.ballOne && !this.ballTwo){
            this.ballTypeNum = 1;
            console.log('空心球')
        }else if(this.ballOne && !this.ballTwo){
            this.ballTypeNum = 2
            console.log('篮板球')
        }else if(this.ballThree){
            this.ballTypeNum = 3;
            console.log('高弧度球')
        }

        //高弧度球
        switch(this.ballTypeNum){
            case 0:
                //普通球，普通加分效果
                console.log('普通球')
                this.game.effectIndex = 0;
            break;
            case 1:
                //空心球specialball03.png
                cc.loader.loadRes("image/specialball03", cc.SpriteFrame, function (err, spriteFrame) {
                    sp.spriteFrame = spriteFrame;
                    self.ballInAnim(node);
                    self.ballTypeNum = 0;
                });
                this.game.effectIndex++;
            break;
            case 2:
                //篮板球
                cc.loader.loadRes("image/specialball01", cc.SpriteFrame, function (err, spriteFrame) {
                    sp.spriteFrame = spriteFrame;
                    self.ballInAnim(node);
                    self.ballTypeNum = 0;
                });
                this.game.effectIndex++;
            break;
            case 3:
                //高弧度球
                cc.loader.loadRes("image/specialball02", cc.SpriteFrame, function (err, spriteFrame) {
                    sp.spriteFrame = spriteFrame;
                    self.ballInAnim(node);
                    self.ballTypeNum = 0;
                });
                this.game.effectIndex++;
            break;
            case 4:
                //压哨球
                cc.loader.loadRes("image/specialball04", cc.SpriteFrame, function (err, spriteFrame) {
                    sp.spriteFrame = spriteFrame;
                    self.ballInAnim(node);
                    self.ballTypeNum = 0;
                });
                clearTimeout(window.timeOut);
                this.game.effectIndex++;
            break;
        }

        if(this.game.effectIndex >= 2){
            this.game.basketEffect();
        }
        if(this.game.directionMove){
            this.game.moveDisappear(this.game.basketRight, function() {
                this.game.moveAppear(this.game.basketLeft);
                this.game.recoverBasketEffect()
            }.bind(this));
        }else{
            this.game.moveDisappear(this.game.basketLeft, function() {
                this.game.moveAppear(this.game.basketRight);
                this.game.recoverBasketEffect()
            }.bind(this));
        }
        
        this.game.directionMove = !this.game.directionMove;
        this.directiveMove = !this.directiveMove;

        this.setAddScorePos();
    },
    /**进球类型动画 */
    ballInAnim(node) {
        node.position = {
            x: -200,
            y: 200
        }
        this.node.parent.addChild(node)
        node.runAction(cc.sequence(
                       cc.moveTo(0.1, cc.p(0, 200)),
                       cc.moveTo(0.9, cc.p(0, 200)),
                       cc.moveTo(0.1, cc.p(200, 200)),
                       cc.callFunc(function() {
                           node.parent = null;
                       })
        ))
    },
    /**设置加分位置 */
    setAddScorePos() {
        let addPoint = new cc.Node('Point')
        let sp = addPoint.addComponent(cc.Label);
        let tmpScore = 0;
        if(this.game.effectIndex >= 1){
            tmpScore = this.game.effectIndex *2;
            sp.string = '+ '+ tmpScore
        }else{
            tmpScore = 1;
            sp.string = "+ 1";
        }
        this.game.beforeScore = this.game.score;
        this.game.score = this.game.score - 0 + tmpScore
        console.log(this.game.score)

        /**设置分数 */
        this.game.setScoreTmp();
        //获取当前篮筐位置
       
        let pos = this.game.directionMove? this.game.basketRight.position: this.game.basketLeft.position;
        addPoint.position = {
            x: this.game.directionMove? -110: 110,
            y: pos.y
        };

        this.node.parent.addChild(addPoint);
        let move = cc.moveBy(0.8, cc.p(0, 50))
        addPoint.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.8), move), cc.callFunc(function(){
            addPoint.parent = null;
        })))
    }

});
