// app.js
App({
    onLaunch() {
        //自定义导航栏 获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
        wx.getSystemInfo({
            success: (res) => {
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.statusBarHeight = res.statusBarHeight//工具栏高度
                //胶囊高度
                this.globalData.navBarHeight = Math.floor(custom.top - res.statusBarHeight)*2 + custom.height
                this.globalData.pageHeight = res.screenHeight
            }
        })
    },
    globalData: {
        // url: "http://192.168.7.205:8082"
        url: "https://anloner.github.io/:8082",
        // url: "http://192.168.10.3:8082",
        appID: "wxa0ddf08fce7e21f6",
        secret: "739c889e20c9d546f25edd840cba80b2",
        statusBarHeight: 0,
        navBarHeight: 0,
        pageHeight: 0
    },
})
