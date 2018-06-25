let http = require('http')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.previewAd();
    },
    previewAd() {
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            http.ad({
                position: 1
            }, result => {
                wx.previewImage({
                    // urls: [result.data.],
                    complete: function() {
                        wx.hideLoading();
                    }
                })
            })
            
        }, this)
    }
});
