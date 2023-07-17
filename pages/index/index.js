import { request } from "../../utils/request";

// pages/index/index.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    hotEssayList:[],
    hotTestList:[],
    notice: {},
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotEssay();
    this.getHotTest();
    this.getNotice();
  },

  //关闭公告
  showCard(){
    this.setData({
      isShow: false
    })
  },

  //获取推荐文章
  getHotEssay(){
    request({
      url:'/essay/getEssayList',
      data:{
        pageIndex: 1,
        pageSize: 6,
        hot: "hot"
      },
      method:"POST",
    }).then(res =>{
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          hotEssayList: records
        })
      }
    })
  },

  //获取推荐自评
  getHotTest(){
    request({
      url:"/test/getTestList",
      data:{
        pageIndex: 1,
        pageSize: 3,
        orderType: "hot"
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          hotTestList: records
        })
      }
    })
  },

  //获取公告信息
  getNotice(){
    request({
      url:`/sys/getNoticeList/${1}`,
      method:"GET"
    }).then(res => {
      if(res.data.code == 200){
        let notice = res.data.data;
        console.log(notice);
        if(notice.length == 1){
          // this.setData({
          //   notice: res.data[0],
          //   isShow: true
          // })
          console.log("1");
          wx.showModal({
            title: '公告',
            content: notice[0].content,
            showCancel: true,
            cancelText: '关闭',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {},
            fail: ()=>{},
            complete: ()=>{}
          });
        }
        
      }
    })
  },

  //跳转测试详情页面
  toTestDetail(e){
    let {index} = e.currentTarget.dataset;
    //将被点击的测试数据存入缓存
    wx.setStorageSync("testItem", this.data.hotTestList[index]);
    wx.navigateTo({
      url: '/pages/testDetail/testDetail',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  //跳转测试页面
  toTestPage(){
    wx.switchTab({
      url: '/pages/testPage/testPage',
    });
  },

  //跳转文章详情页
  toEssayDetail(e){
    //将被点击的咨询师数据存入缓存
    wx.setStorageSync("essayItem", this.data.hotEssayList[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '/pages/essayDetail/essayDetail',
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