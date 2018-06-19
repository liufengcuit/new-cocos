cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.scaleProgress()
        this.countTime(function(res){console.log(res)})
    },
    countTime(call) {
        this.time = this.setTime(39)

        let bar = this.node.getChildByName('timebar').getComponent(cc.ProgressBar);
        bar.progress = 1;
        window.timer = setInterval(function() {
            bar.progress = bar.progress.toFixed(4) - 0.0005*16.6/this.time
            if(bar.progress <= 0){
                clearInterval(window.timer)
                call(0)
                console.log('停止计时')
            }
        }.bind(this),5)

    },
    setTime(level) {
        if(level == 1){
            return -1
        }else if(level >= 2 && level <= 5){
            return 11;
        }else if(level >= 6 && level <= 10){
            return 10
        }else if(level >= 11 && level <= 15) {
            return 9
        }else if(level >= 16 && level <= 20) {
            return 8
        }else if(level >= 21 && level <= 25){
            return 7
        }else if(level >= 26 && level <= 30){
            return 6
        }else if(level >= 31 && level <= 35) {
            return 5
        }else{
            return 4
        }
    },

    start () {

    },
    scaleProgress() {
        let scaleMax = cc.scaleBy(0.2, 1.5)
        let scaleMin = cc.scaleBy(0.2, 0.75)
        this.node.runAction(cc.sequence(scaleMax, scaleMin));
    }
});
