var Ball = require('ball')
var Score = require('score')

cc.Class({
    extends: cc.Component,

    properties: {
        ball: Ball,
        scores: Score
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        /**判断是否需要加载3,2,1倒计时 */
        this.isLoading();
        /**开启物理组件碰撞系统 */
        cc.director.getPhysicsManager().enabled = true;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            if(this.isProgressEnd() <= 0){
                this.isClick = false;
                return false;
            }
            this.ball.initBallType();
            this.basketball = this.node.getChildByName('basketball')
            this.bodyJump = this.basketball.getComponent(cc.RigidBody);
            // 设置移动速度
            if(this.directionMove){
                this.bodyJump.linearVelocity = cc.v2(250,1500);
            }else{
                this.bodyJump.linearVelocity = cc.v2(-250, 1500)
            }
        }, this)

        this.init();

        /**设置篮球阴影 */
        this.shadowWidth = this.node.getChildByName('shadow').width
        this.shadowHeight = this.node.getChildByName('shadow').height
        this.y = this.node.getChildByName('shadow').y
    },
    isLoading() {
        let self = this;
        let ballNode = this.node.parent.getChildByName('level')
        if(window.gameMode == 1){
            cc.loader.loadRes("prefab/gameLoadingView", cc.Prefab, function (err, pre) {
                let newNode = cc.instantiate(pre);
                newNode.width = window.game_width;
                newNode.height = window.game_height;
                newNode.position={
                    x: window.game_width/2,
                    y: window.game_height/2
                }
                cc.director.getScene().addChild(newNode);
            })
            let time = 3
            let timer = setInterval(function(){
                time--;
                if(time == -1){
                    self.node.getChildByName('basketball').position={x:0,y: 206}
                    ballNode.destroy();
                }
            },1000);
        }else{
            ballNode.destroy();
        }
    },

    init: function() {
        this.basketRight = this.node.getChildByName('basket')
        this.basketLeft = this.node.getChildByName('basket-copy')
        this.node.getChildByName('effect').zIndex = 20;
        this.node.getChildByName('effect-copy').zIndex = 20;
        this.node.getChildByName('basketball').zIndex = 10;

        this.score = 0;
        this.beforeScore = 0;
        this.directionMove = true;
        this.effectIndex = 0;
        this.ball.initBall(this);
        this.scores.initScore(this);
        this.initBasketPos();

        /**判断按钮是否可以被点击 */
        this.isClick = true;
        this.isNext = true;

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
    },
    update( dt ){
        let shadow = this.node.getChildByName('shadow');
        let ball = this.node.getChildByName('basketball')
        shadow.position = {
            x: ball.position.x,
            y: -636
        }

        if(ball.y > 0 && ball.y < 334){
            shadow.width = 686/(ball.y - this.y) * this.shadowWidth;
            shadow.height = 686/(ball.y - this.y) * this.shadowHeight;
        }else if(ball.y >= 334){
            shadow.width = this.shadowWidth * 0.5;
            shadow.height = this.shadowHeight *0.5;
        }else{
            shadow.width = this.shadowWidth;
            shadow.height = this.shadowHeight;
        }

        /**判断是否结束当前比赛 */
        if(!this.isClick && this.isNext){
            this.isNext = false;
            this.nextPage();
        }
    },
    /**进入下一个场景 */
    nextPage() {
        window.timeOut = setTimeout(()=> {
            window.lastScore = this.score;
            cc.director.loadScene('gameOver');
        }, 1000);
    },
    /**篮筐特效 */
    basketEffect() {
        let color = new cc.Color(0,0,0,255)
        this.setBasketColor(color);
        this.directionMove ? 
            this.basketRight.getChildByName('explosion').getComponent(cc.Animation).play("explosion"):
            this.basketLeft.getChildByName('explosion').getComponent(cc.Animation).play("explosion");
    },
    /**恢复篮筐样式 */
    recoverBasketEffect() {
        let color = new cc.Color(255,255,255,255)
        this.setBasketColor(color);
    },
    /**设置篮筐颜色 */
    setBasketColor(color) {
        if(this.directionMove){
            this.basketRight.getChildByName('back').color = color;
            this.basketRight.getChildByName('front').color = color;
            this.node.getChildByName('effect').color = color;
        }else{
            this.basketLeft.getChildByName('back').color = color;
            this.basketLeft.getChildByName('front').color = color;
            this.node.getChildByName('effect-copy').color = color;
        }
    },
    /**判断进度条是否已经加载完成 */
    isProgressEnd() {
        return this.node.parent.getChildByName('timebar').getChildByName('timebar').getComponent(cc.ProgressBar).progress;
    },
    /**设置分数 */
    setScoreTmp() {
        this.scores.setScore(this.score);
    }
});