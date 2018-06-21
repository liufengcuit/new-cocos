cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        //加载num图集
        let self = this;
        cc.loader.loadRes("texture/num", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame('0');
            self.node.getChildByName("score").getComponent(cc.Sprite).spriteFrame = frame;
            self.atlas = atlas;
        });
    },
    initScore(game) {
        this.game = game;
    },
    setScore: function(score) {
        let before = this.game.beforeScore.toString().split('')
        let beforeLen = before.length;
        let cloneNode = null;
        let arrNum = this.game.score.toString().split('')
        let len = arrNum.length;

        
        if(len == 1){
            let sps = this.node.getChildByName("score").getComponent(cc.Sprite);
            sps.spriteFrame = this.atlas.getSpriteFrame(this.game.score);
            this.scaleAnim()
        }else{

            if(len > beforeLen){
                cloneNode = cc.instantiate(this.node.getChildByName('score'));
                this.node.addChild(cloneNode);
            }

            let allChildren = this.node.children;
            
            for(let i = 0;i <len ;i++){
                allChildren[i].getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(arrNum[i]);
            }
            this.scaleAnim()
        }
    },
    // 分数放大动画
    scaleAnim() {
        let max = cc.scaleBy(0.1, 1.5);
        let min = cc.scaleTo(0.1, 0.75);

        this.node.runAction(cc.sequence(max, min));
    }
});
