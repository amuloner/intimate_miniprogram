import { request } from "../../utils/request";

// pages/evaluation/evaluation.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    leftMenuList:["全部","性格","情感","职场","健康","人际","亲子","能力"],
    selectArray: [
      {
        "id": "1",
        "text": "按时间",
        "order": "date"
      },
      {
        "id": "2",
        "text": "按热度",
        "order": "hot"
      }
    ],
    testList:[],
    // 左侧菜单被点击的索引
    currentIndex:0,
    // 左侧菜单被点击的类别
    typeTitle:'',
    // 右侧滚动条距离
    scrollTop:0,
    orderType: "date",//排序方式
    pageIndex: 1,
    pageSize: 5,
    loadBool: false//新数据加载是否进行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryTestList(0)
  },

  // 左侧点击事件
  handleItemTap(e){
    // 获取点击标题的索引
    const {index,name} = e.currentTarget.dataset;
    if(this.data.currentIndex != index){
      this.setData({
        currentIndex:index,
        typeTitle:name,
        // 设置右侧内容滚动置顶
        scrollTop: 0
      })
      this.queryTestList(0);
    }
  },
  
  //获取测试列表
  queryTestList(type){//type=0第一次查询，type=1上拉添加数据查询
    request({
      url:"/test/getTestList",
      data:{
        label: this.data.typeTitle,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        orderType: this.data.orderType
      },
      method:"POST"
    }).then(res => {
      if(res.data.code == 200){
        let {records} = res.data.data;
        if(type == 1){
          //添加新的数据进去
          records = [...this.data.testList,...records];
        };
        this.setData({
          testList: records
        })
      }
    })
  },

  //跳转测试页面
  toTestDetail(e){
     let {index} = e.currentTarget.dataset;
      //将被点击的测试数据存入缓存
      wx.setStorageSync("testItem", this.data.testList[index]);
      wx.navigateTo({
        url: '/pages/testDetail/testDetail',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
  },

  //改变排序
  orderItemChange(e){
    if(this.data.orderType != e.detail){
      this.setData({
        orderType: e.detail
      });
      this.queryTestList(0);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  //上拉加载更多数据
  getNewData() {
    console.log("上拉");
    if(!this.data.loadBool){
      //获取新的数据
      this.setData({
        pageIndex: this.data.pageIndex + 1,
      });
      this.queryTestList(1);
      this.setData({
        loadBool: true
      })
    }
  },
})