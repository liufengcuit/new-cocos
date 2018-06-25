cc.Class({
    extends: cc.Component,

    properties: {
    },
    copyId(event) {
        console.log('复制单号')
        console.log(this.node)
        wx.setClipboardData({
            data: '数据',
            success: function() {
                wx.showToast({
                    title: '复制成功',
                    icon:'',
                    image: '',
                    duration: 50
                })
            },
            fail: function() {
                wx.showToast({
                    title: '复制失败',
                    icon:'',
                    image: '',
                    duration: 50
                })
            }
        })
    },
    getLottery() {
        wx.showModal({
            title: '',
            content: '如客服没有自动发送领取流程，请搜索并关注公众号【公仔欢乐园】领取',
            showCancel: false,
            cancelText: '',
            confirmText: '好的',
            success: function() {
                wx.openCustomerServiceConversation();
            }
        })
    },

    start () {

    },

    // update (dt) {},
});
