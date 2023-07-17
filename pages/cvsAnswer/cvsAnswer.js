import { formatDate } from "../../utils/myFun";
import { request } from "../../utils/request";

// pages/cvsAnswer/cvsAnswer.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示离线   1表示显示    0表示不显示
      title: '回答', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight + app.globalData.navBarHeight,
    pageHeight:  app.globalData.pageHeight,
    index: 0
  },


  //保存评论
  /**
   * qId 问题id
   * content 内容
   * fromId 用户
   * date 时间
   * 
   * toId
   * answerId
   */
  formSubmit(e){
    console.log(e);
    let {content} = e.detail.value
    if(!content.trim()){
      this.setData({
        content: ""
      });
      wx.showToast({
        title: '请先输入内容！',
        duration: 1500,
        mask: false
      });
      return;
    };
    request({
      url: "/answer/sendAnswer",
      data: {
        qId: wx.getStorageSync("questionItem").id,
        content,
        fromId: wx.getStorageSync("userInfo").id,
        date: formatDate(new Date(new Date().getTime()), "YYYY-MM-DD")
      },
      method: "POST"
    }).then(res => {
      console.log(res);
      if(res.data.code == 200){
        let pages = getCurrentPages();
        let currPage = null; //当前页面
        let prevPage = null; //上一个页面

        if (pages.length >= 2) {
            currPage = pages[pages.length - 1]; //当前页面
            prevPage = pages[pages.length - 2]; //上一个页面
        }
        if(prevPage){
            this.getAnswerList(prevPage);
         }
        //发表成功，返回原页面
        wx.navigateBack({
          delta: 1
        });
      };
    })
  },

    //获取相关问题的回复数据
    getAnswerList(that){
      request({
        url:'/answer/getAnswerList',
        method: 'POST',
        data: {
          questionId: this.data.index,
          pageIndex: 1,
          pageSize: 50
        }
      })
      .then(res => {
        if(res.data.code === 200){
          let answerList = res.data.data.records;
          let showAll = [];
          answerList.forEach((item,index) => {
            showAll.push({id: index,status: false});
          });
          showAll.push({id: answerList.length, status: false});
          that.setData({
            answerList,
            showAll
          })
        }
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      index: options.index
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