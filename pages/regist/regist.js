import { request, uploadFile } from "../../utils/request";

// pages/regist/regist.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_img: app.globalData.url+'/images/backImg.jpg',
    avatarUrl:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickName: "微信用户",
    openID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      openID: options.openID
    })
  },

  //注册
  toRegist(){
    //上传头像到服务器中保存
    uploadFile({
      url: '/sys/fileUpload',
      filePath: this.data.avatarUrl,
      name: "file",
      method: "POST",
      formData:{
        "type": "head_img"
      }
    }).then(res => {
      //请求注册
      console.log(res);
      request({
        url:"/user/toRegist",
        data:{
          avatarUrl: JSON.parse(res.data).data,
          nickName: this.data.nickName,
          openID: this.data.openID
        },
        method: "POST"
      }).then(res => {
        if(res.data.code == 200){
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      })
    });
  },

  //获取用户昵称
  checkNickname(e){
    let nickname = e.detail.value;
    if(nickname.trim()){
      this.setData({
        nickName: nickname
      })
    }
  },

  //获取用户头像
  onChooseAvatar(e) {
    console.log(e);
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    });
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