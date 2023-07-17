import { request } from "../../utils/request";

// pages/login/login.js
let app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_img: app.globalData.url+'/images/backImg.jpg',
    log_img: app.globalData.url+'/images/log.png',
    
  },

  //登录
  toLogin(){
    wx.login({
      timeout:10000,
      success: (result) => {
        console.log(result.code);
        if (result.code) {
          //请求后端用户数据
          request({
            url: '/user/toLogin',
            data: {
              code: result.code,
              appID: app.globalData.appID,
              secret: app.globalData.secret
            },
            method:"POST"
          }).then(res => {
            if(res.data.code == 200){
              //查询到用户数据，存入缓存
              let userInfo = res.data.data;
              wx.setStorageSync("userInfo", userInfo);
              //查看是否具有url缓存
              let navUrl = wx.getStorageSync("navUrl");
              if(navUrl){
                //跳转原页面
                if(navUrl.type == "tabbar"){
                  wx.switchTab({
                    url: navUrl.url,
                    complete: ()=>{wx.removeStorageSync("navUrl");}
                  });
                }else if(navUrl.type == "page"){
                  wx.redirectTo({
                    url: navUrl.url,
                    complete: ()=>{wx.removeStorageSync("navUrl");}
                  });
                }
              }else{
                wx.switchTab({
                  url: '/pages/person/person'
                });
              }
            }else{
              //无用户数据，跳转注册
              wx.redirectTo({
                url: `/pages/regist/regist?openID=${res.data.data.openid}`
              });
            }
            
          })
        }
      },
      fail: () => {console.log('登录失败！' + res.errMsg)},
      complete: () => {}
    });
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})