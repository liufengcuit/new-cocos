cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let progress = this.node.parent.getChildByName('progress').getComponent(cc.ProgressBar)
        let time = 3;
        this.index = 0;
        console.log(progress)
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            console.log('点击')
            
            progress.progress = 1
            this.unschedule(this.test2)

            this.test2 = function() {
                this.create()
                progress.progress = progress.progress - 0.1
                if(time == 3){
                    this.unschedule(this.test2)
                    console.log('停止计时器')
                    return false;
                    
                }
                console.log('执行')
            }

            
            this.schedule(this.test2, 10)


           let timer = setInterval(function() {
                progress.progress = progress.progress - 0.001*2;
                
                if(progress.progress<=0 ){
                    clearInterval(timer)
                    this.create()
                    console.log('停止')
                    return false;
                }

                console.log('计时')
           }.bind(this), 10000)
            


        }, this)
    },
    create() {
        this.index++;
        let node = new cc.Node('label')
        let label = node.addComponent(cc.Label)
        
        if(this.index >=2){
            label.string = '10s'
            node.position = {
                x: 50,
                y: 50
            }
        }else{
            label.string = '5s'
        }
        
        this.node.parent.addChild(node)
        console.log('10s执行')
    },

    start () {

    },
});
