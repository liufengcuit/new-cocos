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
            wx.previewImage({
                urls: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529842007510&di=79992a39098ba201478998a008e00edf&imgtype=0&src=http%3A%2F%2Fww1.sinaimg.cn%2Flarge%2F6d0eb164jw1emxmskpy4ej21hc1z4b2a.jpg"],
                complete: function() {
                    wx.hideLoading();
                }
            })
        }, this)
    }
});
