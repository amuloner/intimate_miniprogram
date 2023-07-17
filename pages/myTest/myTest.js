// pages/myTest/myTest.js
import { request } from "../../utils/request";
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    pageIndex: 1,
    pageSize: 5,

    userInfo:{},
    testRList:[]
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
    })
    this.queryTestRList();
  },


  /**获取个人测试数据列表
   * 根据用户id查询测评结果及其相关测评内容
   */
  queryTestRList(){
    request({
      url:"/test/getTestRList",
      data:{
        userId: this.data.userInfo.id,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          testRList: records
        })
        console.log(res);
      }
    })
  },

  //跳转测试结果页面
  toTestDetail(e){
    let {index} = e.currentTarget.dataset;
    //将测试结果JSON字符串传递过去
    var myNature = this.data.testRList[index].resultJson;
    wx.navigateTo({
      url: `/pages/testDetail/testDetail?page=myTest&myNature=${myNature}`,
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