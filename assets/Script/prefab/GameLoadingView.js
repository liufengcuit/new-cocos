

cc.Class({
    extends: cc.Component,

    properties: {

        timeLab:{
            default:null,
            type: cc.Node
        }
    },
    backHome:function(){
        clearInterval(this.time );
        cc.game.removePersistRootNode(this.node);
        cc.director.loadScene("Home");
    },
    onLoad:function(){
        let self = this;
        let time = 3;
        let timer = setInterval(function(){
            time--;
            self.timeLab.getComponent(cc.Label).string = time;
            if(time == -1){
                self.node.destroy();
                clearInterval(timer);
            }
        },1000);
        this.time = timer;

    }


});
