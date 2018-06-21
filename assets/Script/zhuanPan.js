
let http = require('http');

cc.Class({
    extends: cc.Component,

    properties: {
        //转盘内容
        contentView:{
            default:null,
            type: cc.Node
        },
        //转盘内容
        tishiLab:{
            default:null,
            type: cc.Node
        },
        //
        gameBackBtn:{
            default:null,
            type: cc.Node
        },
        startBtn:{
            default:null,
            type: cc.Node
        },
        //
        shareBtn:{
            default:null,
            type: cc.Node
        },
        //
        playAgainBtn:{
            default:null,
            type: cc.Node
        },
        //
        kuangView:{
            default:null,
            type: cc.Node
        },
         //
         title2:{
            default:null,
            type: cc.Node
        },
         //
         lingquBtn:{
            default:null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        let self = this;
        this.awardList = [];//奖品数组
        this.indexSelect = 0;//被选中的奖品index
        this.isRunning = false;//是否正在抽奖
        this.gameBackBtn.getComponent(cc.Widget).top = 20 + window.localData.stageTop;
        this.gongzai = null;
        //添加事件
        this.gameBackBtn.on(cc.Node.EventType.TOUCH_START,function(){
            cc.director.loadScene("startGame",function(res){
                console.log(res);
            });
        },this);
        this.startBtn.on(cc.Node.EventType.TOUCH_START,this.startGameGetNet,this);
        this.kuangView.active = false;

        this.shareBtn.on(cc.Node.EventType.TOUCH_START,this.share,this);
        this.playAgainBtn.on(cc.Node.EventType.TOUCH_START,this.onResetGameClick,this);
        this.lottery_config = null;
        this.reelect_time = 0;
        // this.lingquBtn.active = false;
        this.lingquBtn.on(cc.Node.EventType.TOUCH_START,this.showGongzai,this);

        this.lingquBtn.active = false;
        this.shareBtn.active = false;
        this.playAgainBtn.active = false;

    },
    start:function(){

        console.log(this.lottery_config );
        this.reelect_time = this.lottery_config.reelect_time;
        let self = this;
        for (let i = 0; i<8;i++){
            let newIndex = i+1;
            cc.loader.load(this.lottery_config.options["doll" + newIndex].url,function(err,texture){
                if(texture){
                    let frame = new cc.SpriteFrame(texture);
                    self.contentView.getChildByName("image" + newIndex).getComponent(cc.Sprite).spriteFrame = frame; 
                }
            });
        }
        
    },
     //分享
     share:function(res){
        let self = this;
        let share = window.localData.game_share["6"];
        if(!share){
            share = window.localData.game_share["1"];
        }
        wx.shareAppMessage({ title: "[" + window.localData.shareUserInfo.nickName +"@我]" + share.content, imageUrl: share.img, query: "clickId=" + res, success: (res) => {
            console.log('分享成功回调', res);
            util.showToast("分享挑战成功","fail",false);
            self.shareUpdate();
        }, fail: (res) => {
            util.showToast("分享失败","fail",false);
        },complete:(res)=> {}});
    },

    startGameGetNet:function(){
        if (this.isRunning || this.reelect_time == 0) {
            if(this.reelect_time == 0){
                util.showCustomToast("次数超限","none",false);
            }
            return;
        }
   
        var that = this;
        http.lottery({openid:window.localData.openid,log_id:this.lottery_config.log_id},function(res){
            console.log(res);
            switch(res.result){
                case 0:{ util.showCustomToast("系统异常","none",false);} break;
                case 1:{ 
                    let doll_key = res.doll_key;
                    that.gongzai = that.lottery_config.options[doll_key];
                    that.startGame(parseInt(doll_key.slice(4,5)));
                } break;
                case 2:{ util.showCustomToast("次数超限","none",false);} break;
                case 3:{ util.showCustomToast("没有挑战记录","none",false);} break;
                case 4:{ util.showCustomToast("挑战和摇奖不是同一个用户","none",false);} break;
                case 5:{ util.showCustomToast("挑战没有成功","none",false);} break;
                case 6:{ util.showCustomToast("重摇次数超限","none",false);} break;

            }
        },function(){
            
        });

    },
    resChoose:function(){
        let self = this;
        wx.showModal({
            title: '',
            content: '邀请好友来帮你重选一次吧',
            showCancel: true,//去掉取消按钮
            success: function (res) {
                if (res.confirm) {
                    let share = window.localData.game_share["7"];
                    if(!share){
                        share = window.localData.game_share["1"];
                    }
                    wx.shareAppMessage({title: "[" + window.localData.shareUserInfo.nickName +"@我]" + share.content,imageUrl: share.img, query: "",success:function(){
                        cc.loader.loadRes("game/zhuan_start",cc.SpriteFrame,function(err,spriteFrame){
                            self.startBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        });
                        self.startBtn.off(cc.Node.EventType.TOUCH_START,self.resChoose,self);
                        self.startBtn.on(cc.Node.EventType.TOUCH_START,self.startGameGetNet,self);
                    }});
                }
            }
        });
    },
    startGame:function(index){
        console.log("中奖公仔",index);
        this.isRunning = true;
        var self = this;
        var indexSelect = 0;
        var i = 0;
        var isJian = 0;
        //3为中奖号码
        var random = 160 + 10*(index-1) + 80;
        function callback(){
            indexSelect++;

            //这里我只是简单粗暴用y=10*x+50函数做的处理.可根据自己的需求改变转盘速度
            if(isJian == 2){
                i += 10;
            }
            console.log(i,random);
            if (i > random ){
                self.lingquBtn.active = true;
                self.shareBtn.active = true;
                self.playAgainBtn.active = true;
                self.isRunning = false;
                self.tishiLab.getComponent(cc.Label).string = "恭喜获得" + self.gongzai.name + "公仔";
                self.title2.getComponent(cc.Label).string = "请到我的公仔中领取";
                if(self.reelect_time > 0){
                    this.reelect_time--;
                    cc.loader.loadRes("game/zhuan_again",cc.SpriteFrame,function(err,spriteFrame){
                        self.startBtn.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });
                    self.startBtn.off(cc.Node.EventType.TOUCH_START,self.startGameGetNet,self);
                    self.startBtn.on(cc.Node.EventType.TOUCH_START,self.resChoose,self);
                }else{
                    self.startBtn.active = false;
                }
                // self.lingquBtn.active = true;
              return;
            }
            cc.audioEngine.play(cc.url.raw("resources/audio/碰撞.mp3"),false,1);
            indexSelect = indexSelect % 8;
            if(indexSelect == 0 && isJian< 2){
                isJian++;
            }
            self.indexSelect = indexSelect;
            self.kuangView.active = true;
            var newIndex = indexSelect + 1;
            self.kuangView.position = self.contentView.getChildByName("image" + newIndex ).position;
            setTimeout(callback , (80 + i));
          }
        setTimeout(callback , (80 + i));
    },
      //开始按钮点击
      onResetGameClick:function()
      {
          var that = this;
          http.challengeCheck({openid:window.localData.openid},function(res){
              console.log(res);
              if (res.result){
                that.reStartGame();
                window.localData.use_num = res.use_num;
              }else{
                  that.getShare();
              }
          },function(){
          });
  
      },
      getShare:function(){
        var that = this;
        wx.showModal({
            title: "获取更多挑战机会", 
            content: "分享成功后，即可再玩一次", 
            showCancel: true, cancelText: "取消", 
            cancelColor: "#404040", 
            confirmText: "去分享",
            confirmColor: "#00c200",
            success: (res) => {
                if (res.cancel == true){
                    return;
                }
                let share = window.localData.game_share["6"];
                if(!share){
                    share = window.localData.game_share["1"];
                }
                wx.shareAppMessage({ title: "[" + window.localData.shareUserInfo.nickName +"@我]" + share.content, imageUrl: share.img, query: "", success: (res) => {
                    console.log('分享成功回调', res);
                    if (!res.shareTickets){
                        wx.showModal({ title: "", content: "对不起，分享给群才能获得更多挑战机会", showCancel: false, cancelText: "", cancelColor: "", confirmText: "确定", confirmColor: "#00c200", success: (res) => {}, fail: (res) => {}, complete: (res) => {} })
                    }else{
                        wx.getShareInfo(res.shareTickets[0]).then((res) =>{
                            console.log(res)
                            http.share({openid:window.localData.openid,encryptedData:res.encryptedData,iv:res.iv},function(res){
                                if (res == 1){
                                    
                                    that.reStartGame();
                                }else if (res == -1){
                                    wx.showModal({ title: "", content: "抱歉，分享次数已达上限", showCancel: false, cancelText: "", cancelColor: "", confirmText: "确定", confirmColor: "#00c200", success: (res) => {}, fail: (res) => {}, complete: (res) => {} })
                                }else if (res == -2){
                                    wx.showModal({ title: "", content: "抱歉，今天已经在该群分享过了", showCancel: false, cancelText: "", cancelColor: "", confirmText: "确定", confirmColor: "#00c200", success: (res) => {}, fail: (res) => {}, complete: (res) => {} })
                                }else if (res == -3){
                                    wx.showModal({ title: "", content: "解密失败", showCancel: false, cancelText: "", cancelColor: "", confirmText: "确定", confirmColor: "#00c200", success: (res) => {}, fail: (res) => {}, complete: (res) => {} })
                                }
                            },function(){
                                
                            })
                        })
                    }

                }, fail: (res) => {
                    util.showCustomToast("分享失败","fail",true);          
                },complete:(res)=> {}});
            }, 
            fail: (res) => {},
            complete: (res) => {} });
    },
    //开始按钮点击
    reStartGame:function()
    {
        let self = this;
        http.ticketCheck({
            openid: window.localData.openid
        }, function (res) {
            console.log(res);
            if (res.result) {
                window.localData.isGameChallge = true;
                cc.loader.loadRes("prefrab/gameLoadingView", cc.Prefab, function (err, pre) {
                    let loading = cc.instantiate(pre);
                    loading.x = 0;
                    loading.y = 0;
                    loading.width = window.localData.game_width;
                    loading.height = window.localData.game_height;
                    cc.game.addPersistRootNode(loading);
                    self.reStartCallGame();
                });
                window.localData.use_num = res.use_num;
            } else {
                self.showNoneQuan();
            }
        }, function () {});
    },
    reStartCallGame:function(){
        this.node.emit("clickBack",{type:1});//重新开始
        this.node.parent = null;
        this.node.destroy();
    },
    showGongzai:function(){
        let self = this;
        cc.loader.loadRes("prefrab/GetGongzai",cc.Prefab,function(err,pre){
            let gongzai = cc.instantiate(pre);
            gongzai.parent = self.node.parent;
            gongzai.width = window.localData.game_width;
            gongzai.height = window.localData.game_height;
        });
    },
    showNoneQuan: function () {
        var self = this;
        cc.loader.loadRes("prefrab/quanPop", cc.Prefab, function (err, pre) {
            var quan = cc.instantiate(pre);
            //fox
            quan.getComponent("QuanPop").setCurrenteString(2,"好友点入，即可获得1张","",0);
            quan.parent = self.node;
            quan.width = window.localData.game_width;
            quan.height = window.localData.game_height;
        });
        

    },
    
});
