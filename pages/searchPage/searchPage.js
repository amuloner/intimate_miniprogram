import { request } from "../../utils/request";

// pages/searchPage/searchPage.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    isInput: false,//记录输入框内是否有内容
    isSearch: false,//记录是否已出搜素结果
    currentNav: 0,//当前导航index

    url: app.globalData.url,
    tabs:[
      {
        id:0,
        title:"综合",
        isActive:true
      },
      {
        id:1,
        title:"咨询",
        isActive:false
      },
      {
        id:2,
        title:"文章",
        isActive:false
      },
      {
        id:3,
        title:"问答",
        isActive:false
      },
      {
        id:4,
        title:"测评",
        isActive:false
      }
    ],

    conList: [],
    essayList: [],
    questionList: [],
    testList:[]


  },
  TimeId:-1,//输入框定时器

  //点击热门标签，直接进行搜索
  getSearch(e){
    let {text} = e.currentTarget.dataset;
    this.setData({
      inputValue: text,
      isInput: true
    })
    this.commit();
  },

  //输入事件
  bInput(e){
    clearTimeout(this.TimeId);
    const {value} = e.detail;
    if(!value.trim()){//去掉空格检验是否为空
      this.setData({
        inputValue:"",
        isInput: false
      })
      return;
    }
    // 防抖加延迟
    this.TimeId = setTimeout(()=>{
      this.setData({
        isInput: true,
        inputValue : value
      })
    },500);
  },

  //执行搜索
  //默认执行综合搜索，即各类数据均获取
  commit(){
    if(!this.data.inputValue.trim()) return;
    this.getConList(1, 3, "");
    this.getEssayList(1, 3, "");
    this.getQuestionList(1, 3, "");
    this.getTestList(1, 3, "");
    this.setData({
      isSearch: true
    })
  },

  //点击跳转详情
  toDetail(e){
    let {type,index} = e.currentTarget.dataset;
    if(type == "con"){
      //将被点击的咨询师数据存入缓存
      wx.setStorageSync("conItem", this.data.conList[index]);
      wx.navigateTo({
        url: '/pages/conDetail/conDetail',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    if(type == "essay"){
      //将被点击的文章数据存入缓存
      wx.setStorageSync("essayItem", this.data.essayList[index]);
      wx.navigateTo({
        url: '/pages/essayDetail/essayDetail',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    if(type == "cvs"){
      //将被点击的问题数据存入缓存
      wx.setStorageSync("questionItem", this.data.questionList[index]);
      wx.navigateTo({
        url: `/pages/cvsDetail/cvsDetail?index=${index}`,
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    if(type == "test"){
      //将被点击的测试数据存入缓存
      wx.setStorageSync("testItem", this.data.testList[index]);
      wx.navigateTo({
        url: '/pages/testDetail/testDetail',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },

  //获取咨询
  getConList(pageIndex, pageSize, key){
    request({
      url:'/con/getAllCons',
      data:{
        pageIndex,
        pageSize,
        name: key
      },
      method:"POST",
    }).then(res =>{
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          conList: records
        })
      }
    })
  },

  //获取文章
  getEssayList(pageIndex, pageSize, key){
    request({
      url:'/essay/getEssayList',
      data:{
        pageIndex,
        pageSize,
        author: key,
        title: key,
        content: key
      },
      method:"POST",
    }).then(res =>{
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          essayList: records
        })
      }
    })
  },

  //获取问题数据
  getQuestionList(pageIndex, pageSize, key){
    request({
      url:'/question/getQuestionList',
      data:{
        pageIndex,
        pageSize,
        title: key
      },
      method: 'POST',
    })
    .then(res => {
      if(res.data.code === 200){
        let questionList = res.data.data.records;
        this.setData({
          questionList
        })
      }
    })
  },

  //获取测评
  getTestList(pageIndex, pageSize, key){
    request({
      url:"/test/getTestList",
      data:{
        pageIndex,
        pageSize,
        title: key
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        let {records} = res.data.data;
        this.setData({
          testList: records
        })
      }
    })
  },

  //返回上一页
  exit(){
    wx.navigateBack();
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
      currentNav: index
    });
    if(index == 0){//综合
      if(!this.data.inputValue.trim()) return;
      this.commit();
    }else if(index == 1){//咨询
      if(!this.data.inputValue.trim()) return;
      this.getConList(1, 5, "");
      this.setData({
        essayList: [],
        questionList: [],
        testList:[]
      });
    }else if(index == 2){//文章
      if(!this.data.inputValue.trim()) return;
      this.getEssayList(1, 5, "");
      this.setData({
        conList: [],
        questionList: [],
        testList:[]
      });
    }else if(index == 3){//问答
      if(!this.data.inputValue.trim()) return;
      this.getQuestionList(1, 5, "");
      this.setData({
        conList: [],
        essayList: [],
        testList:[]
      });
    }else if(index == 4){//测评
      if(!this.data.inputValue.trim()) return;
      this.getTestList(1, 5, "");
      this.setData({
        conList: [],
        essayList: [],
        questionList: [],
      });
    }
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