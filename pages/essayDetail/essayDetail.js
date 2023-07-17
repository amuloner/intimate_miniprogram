import { formatDate } from "../../utils/myFun";
import { request } from "../../utils/request";

// pages/essayDetail/essayDetail.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    essayItem: {},
    commentsList:[],
    isShow: false,
    navView: "",//导航标签

    content: "",
    replyUser: "",//回复对象
    fromId: 0,
    toId: 0,
    replyId: 0,//如果是回复，所属主评论的id 

    status: 1 //当前展示文章的审核状态
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.status){
      this.setData({
        status: options.status >= 1 ? 0: 1
      })
    };
    let essayItem = wx.getStorageSync("essayItem");
    if(essayItem){
      this.setData({
        essayItem,
      })
    };

    //获取评论数据
    if(essayItem && this.data.status == 1){
      this.getEssayCom(this.data.essayItem.id);
    }
  },

  //获取相关文章评论数据
  getEssayCom(essayId){
    request({
      url:'/comments/getEssayCom?essayId=' + essayId,
      method: 'Get',
    })
    .then(res => {
      if(res.data.code === 200){
        let commentsList = res.data.data;
        this.setData({
          commentsList
        })
      }
    })
  },

  //发表评论
  //需要文章id、评论内容、评论者id、评论时间、回复标识
  /**
   * essayId 文章id
   * content 评论内容
   * fromId 评论者id
   * toId 如果是回复，则传递回复对象的id
   * date 评论时间
   * replyId 如果是回复，传递所属主评论的id 
   */
  sendComment(){
    let content = this.data.content;
    if(!content.trim()){
      this.setData({
        content: ""
      });
      wx.showToast({
        title: '请先输入内容！',
        duration: 1500,
        icon: 'error',
        mask: false
      });
      return;
    };
    request({
      url: "/comments/sendComment",
      data: {
        essayId: this.data.essayItem.id,
        content,
        fromId: wx.getStorageSync("userInfo").id,
        toId: this.data.toId,
        date: formatDate(new Date(new Date().getTime()), "YYYY-MM-DD"),
        replyId: this.data.replyId
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        this.getEssayCom(this.data.essayItem.id);
      };
      this.hideInput();
    })
  },

  changeValue(e){
    let {value, cursor} = e.detail;
    if(cursor > 0){
      this.setData({
        content: value
      })
    }else{
      this.setData({
        content: ""
      })
    }
  },

  //显示评论输入框
  showInput(e){
    //需要登录，监测是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.setStorageSync("navUrl", {"type": "page", "url": "/pages/essayDetail/essayDetail"});
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    };
    //记录参数，准备请求 toId、replyId
    let {type, item} = e.currentTarget.dataset;
    let replyId = this.data.replyId;
    console.log(item);
    if(type == "reply1"){//对主评论的回复 replyId即主评论的id
      replyId = item.id;
    }else if(type == "reply2"){//对别人的回复的回复 replyId应该是该评论指向的id
      replyId = item.replyId;
    }
    this.setData({
      isShow: true,
      replyId,
      toId: item ? item.fromId : 0,
      replyUser: item ? "to:" + item.fromUser.nickname : ""
    })
  },
  //关闭评论输入框
  hideInput(){
    this.setData({
      isShow: false,
      content: ""
    })
  },

  //添加观看数
  addEssayLikes(){
    request({
      url: "/essay/editEssayById",
      data: {
        id: this.data.essayItem.id,
        readNum: this.data.essayItem.readNum + 1
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        console.log("增加观看");
      };
    })
  },

  //点击进行页面导航
  handlerNav(){
    this.setData({
      navView: "essay_comment"
    })
  },

  //阻止事件捕获的空事件
  stop(){},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.addEssayLikes();
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