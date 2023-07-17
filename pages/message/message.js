import { request } from "../../utils/request"
import {formatDate} from "../../utils/myFun"

// pages/message/message.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    userInfo: {},
    chatList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //需要登录，监测是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.setStorageSync("navUrl", {"type": "tabbar", "url": "/pages/message/message"});
      wx.redirectTo({
        url: '/pages/login/login'
      });
    };
    this.setData({
      userInfo
    })

    //获取未读消息列表
    this.getChatList();
  },

  toMsgPage(e){
    console.log(e);
    wx.setStorageSync("chatItem", this.data.chatList[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '/pages/msgPage/msgPage'
    });
  },

  //获取未读消息列表
  getChatList(){
    request({
      url: "/chat/getChatList",
      data: {
          type: "",
          userId: this.data.userInfo.id
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        let chatList = res.data.data;
        chatList.forEach(element => {
          element.lastChat.ctime = formatDate(new Date(Number(element.lastChat.ctime)), "MM/DD");
        });
        this.setData({
          chatList
        })
      }
    })
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
    this.getChatList();
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