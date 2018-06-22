let http = require('http')
const audioCollect = [
        /**背景 */
        'audio_background',
        /**点击屏幕 */
        'clickball',
        /**进球 */
        '',
        /**喝彩 */,
        '',
        /**时间到 */
        ''
    ]

window._wx = {
    //播放音乐
    playMusic:function(index) {
        let audio = wx.createInnerAudioContext();
        audio.src = "res/raw-assets/resources/audio/" + audioCollect[index] + ".mp3"
        if(index==0){
            audio.loop = true;
            wx.onShow(function () {
                audio.play()
            })
        }
        audio.play()
    },

    //微信分享按钮配置
    shareMenu() {
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    //登录
    login(params,call) {
        wx.getSetting({
            success: function(res){
                //更新session_key
                wx.login({
                    success: function (res) {
                        http.login({
                            wxCode: res.code,
                            encryptedData: params.encryptedData,
                            iv: params.iv
                        }, function(result){
                            console.log(result)
                            // wx.setStorageSync('ball_openid', result.data.openid)
                            call(result.data.life_card)
                        })
                        
                    }
                })
            }
        })
    },

    //session
    checkSession() {
        wx.checkSession({
            success: function() {
            },
            fail: function(res){
                //过期或者未登录
                http.session({
                    wxCode: res.code
                }, function(result){
                })
            }
        })
    }
}