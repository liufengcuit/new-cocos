cc.Class({
    extends: cc.Component,

    properties: {
    },
    countTime(level, call) {
        console.log(level)
        this.time = this.setTime(level)
        window.isScale = true;

        clearInterval(window.timer);
        if(this.time == -1){
            return false;
        }
        let bar = this.node.getChildByName('timebar').getComponent(cc.ProgressBar);
        bar.progress = 1;
        window.timer = setInterval(function() {
            bar.progress = bar.progress.toFixed(4) - 1/(this.time*20)
            if(bar.progress <= 0){
                let audio = wx.createInnerAudioContext();
                audio.src = 'res/raw-assets/resources/audio/over-voice.mp3'
                audio.play();
                clearInterval(window.timer)
                call()
            }
            if(bar.progress < this.isScaleStart && window.isScale){
                window.isScale = false;
                this.scaleProgress();
            }
        }.bind(this),50)

    },
    setTime(level) {
        if(level == 1){
            return -1
        }else if(level >= 2 && level <= 5){
            this.isScaleStart = 0.3;
            return 11;
        }else if(level >= 6 && level <= 10){
            this.isScaleStart = 0.3;
            return 10
        }else if(level >= 11 && level <= 15) {
            this.isScaleStart = 0.3;
            return 9
        }else if(level >= 16 && level <= 20) {
            this.isScaleStart = 0.3;
            return 8
        }else if(level >= 21 && level <= 25){
            this.isScaleStart = 0.4;
            return 7
        }else if(level >= 26 && level <= 30){
            this.isScaleStart = 0.5;
            return 6
        }else if(level >= 31 && level <= 35) {
            this.isScaleStart = 0.6;
            return 5
        }else{
            this.isScaleStart = 0.7;
            return 4
        }
    },
    scaleProgress() {
        let scaleMax = cc.scaleTo(0.2, 1.5)
        let scaleMin = cc.scaleTo(0.2, 1)
        let self = this;
        this.node.runAction(cc.sequence(scaleMax, scaleMin,  cc.callFunc(()=> {
            if(self.node.getChildByName('timebar').getComponent(cc.ProgressBar).progress > 0 && !window.isScale){
                self.scaleProgress();
            }else{
                return false;
            }
        })));
    }
});
