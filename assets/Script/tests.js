cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:http://imgsrc.baidu.com/forum/w=580/sign=1588b7c5d739b6004dce0fbfd9503526/7bec54e736d12f2eb97e1a464dc2d56285356898.jpg

    onLoad () {
        let self = this;
        // 远程 url 带图片后缀名
        var remoteUrl = "http://img3.imgtn.bdimg.com/it/u=1602877593,3608535280&fm=27&gp=0.jpg";
        cc.loader.load(remoteUrl, function (err, texture) {
            // Use texture to create sprite frame
            console.log(texture)
            self.node.getComponent(cc.Sprite).spriteFrame.setTexture(texture)
            
        });
    },

    start () {

    },

    // update (dt) {},
});
