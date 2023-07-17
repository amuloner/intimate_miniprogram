// pages/myEnquiry/myEnquiry.js
import { request } from "../../utils/request";
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    tabs:[
      {
        id:0,
        title:"预约",
        isActive:true
      },
      {
        id:1,
        title:"已完成",
        isActive:false
      }
    ],

    userInfo:{},
    orderList: [],
    type: 0,//0表示预约中，1表示已完成

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.redirectTo({
        url: '/pages/login/login'
      });
    };
    this.setData({
      userInfo
    });
    this.getOrderListById(this.data.type);
  },


  // 子组件点击事件,修改导航样式并显示对应内容
  handleItemTap(e){
    // 获取触发的组件索引
    const {index} = e.currentTarget.dataset;
    // 根据索引处理数据
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs,
      type: index
    });
    this.getOrderListById(this.data.type);
  },

  //获取咨询预约数据 分权限分别获取 1为咨询师，2为普通用户
  getOrderListById(type){
    request({
      url:"/con/getOrderListById",
      data:{
        id: this.data.userInfo.id,
        authority: this.data.userInfo.authority,
        type
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        this.setData({
          orderList : res.data.data
        })
      }
    })
  },

  toMessage(e){
    console.log(e);
    wx.setStorageSync("conItemId", e.currentTarget.dataset.index);
    //携带对象用户id跳转
    wx.navigateTo({
      url: `/pages/msgPage/msgPage?page=con&userId=${this.data.userInfo.id}`,
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
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