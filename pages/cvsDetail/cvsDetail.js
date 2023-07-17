import { request } from "../../utils/request";

// pages/cvsDetail/cvsDetail.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    questionItem: {},
    answerList: [],
    showAll: [],

    scrollTop: 0,//scroll滚动距离
    viewHeight: 0,//页面第一个元素的高度
    isHug: 0,//用户是否点抱抱
    isSame: 0,//用户是否点同感

    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let questionItem = wx.getStorageSync("questionItem");
    if(questionItem){
      this.setData({
        questionItem,
        index: options.index
      });
      this.getAnswerList(questionItem.id);
    };
    this.getUserStar();

  },

  //跳转回答页面
  toAnswerPage(){
    wx.navigateTo({
      url: `/pages/cvsAnswer/cvsAnswer?index=${this.data.questionItem.id}`
    });
  },

  //用户点击抱抱或者同感
  /**
   * qId 问题id
   * userId 用户id
   * type 点击类型
   */
  toStar(e){
    //验证登录
    let userInfo = this.isLogin();
    let {type} = e.currentTarget.dataset;
    let hug = this.data.isHug;
    let same = this.data.isSame;
    if((type == "hug" && hug == 1) || (type == "same" && same == 1 )){
      wx.showToast({
        title: '不能取消喔！',
        icon: 'none',
        duration: 1000,
        mask: false,
      });
      return;
    }
    request({
      url: `/question/saveUserStar/${this.data.questionItem.id}/${userInfo.id}/${type}`,
      method: "GET"
    }).then(res => {
      if(res.data.code == 200){
        if(type == "hug"){
          hug = hug + 1;
          this.setData({
            "questionItem.hugNum": this.data.questionItem.hugNum + hug
          });
        }else{
          same = same + 1;
          this.setData({
            "questionItem.sameNum": this.data.questionItem.sameNum + same
          });
        }
        this.setData({
          isHug: hug,
          isSame: same
        });
      }
    })
  },

  //获取当前用户对问题的抱抱和同感数据
  /**
   * qId 问题id
   * userId 用户id
   */
  getUserStar(){
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      return;
    }
    request({
      url: `/question/getUserStar/${this.data.questionItem.id}/${userInfo.id}`,
      method: "GET"
    }).then(res => {
      console.log(res);
      if(res.data.code == 200){
        this.setData({
          isHug: res.data.data.isHug || 0,
          isSame: res.data.data.isSame || 0
        })
      }
    })
  },

  //获取相关问题的回复数据
  getAnswerList(questionId){
    request({
      url:'/answer/getAnswerList',
      method: 'POST',
      data: {
        questionId,
        pageIndex: 1,
        pageSize: 50
      }
    })
    .then(res => {
      if(res.data.code === 200){
        let answerList = res.data.data.records;
        let showAll = [];
        answerList.forEach((item,index) => {
          showAll.push({id: index,status: true, colNumShow: false});
        });
        showAll.push({id: answerList.length, status: true, colNumShow: false});
        this.setData({
          answerList,
          showAll
        });
        // this.setCheckAll();
      }
    })
  },

  //更改展示状态
  handChangeShow(e){
    let {index} = e.currentTarget.dataset;
    let {showAll} = this.data;
    showAll.forEach((v,i) => {
      if(i === index){
        v.status = !v.status;
      }
    });

    this.setData({
      showAll
    })
  },

  //获取滚动高度
  pageScroll(e){
    let {scrollTop} = e.detail;
    //获取元素高度
    let query = wx.createSelectorQuery();
    query.select('.cvs_header').boundingClientRect(rect =>{
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      this.setData({
        scrollTop,
        viewHeight: clientHeight
      })
    }).exec();
  },

  //验证登录
  isLogin(){
    //需要登录，监测是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.showModal({
        title: '提示',
        content: '您还未登录，是否登录？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.setStorageSync("navUrl", {"type": "page", "url": "/pages/cvsDetail/cvsDetail"});
            wx.redirectTo({
              url: '/pages/login/login'
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    };
    return userInfo;
  },

  //进行行数计算
  setCheckAll() {
    //创建节点选择器
    let showAll = this.data.showAll;
    console.log(showAll);
    showAll.forEach((element, index) => {
      if(index == showAll.length - 1){//问题内容，不能超过3行
        var query = wx.createSelectorQuery();//查询节点信息的对象
        query.select('.tex'+ (showAll.length - 1)).boundingClientRect();//添加节点的布局位置的查询请求
        query.exec((res)=> { //执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回
          // console.log(res[0]);
          // res[0].height;
          // console.log("height==", res[0].height)
          var height = res[0].height;//25为css里设置的view的line-height
          let colNum = height/17.5;//18px为css里设置的view的line-height
          // console.log("行数==", colNum )
          if(colNum > 3){
            showAll[index].colNumShow = true;
          }else{
            showAll[index].colNumShow = false;
          }
        })
      }else{//回复内容，不能超过10行
        var query = wx.createSelectorQuery();
        query.select('.tex'+index).boundingClientRect();//添加节点的布局位置的查询请求
        query.exec( (res)=> { //执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回
          // console.log(res[0]);
          // console.log(`height${index}==`, res[0].height)
          var height = res[0].height;//25为css里设置的view的line-height
          let colNum = height/17.5;//40px为css里设置的view的line-height
          // console.log("行数==", colNum )
          if(colNum > 10){
            showAll[index].colNumShow = true;
          }else{
            showAll[index].colNumShow = false;
          }
        })
      }
    });

    this.setData({
      showAll
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