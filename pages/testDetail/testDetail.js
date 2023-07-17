import { request } from "../../utils/request";

// pages/testDetail/testDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testItem: {},//测试信息
    quesList:[],//问题列表
    answerList: [],  //选项列表

    currentQues: null,//当前问题
    currentIndex: 1, // 当前题号
    totalIndex: 1,  //总计题号

    step: 1,  //执行步骤，1=info,2=doing,3=result
    progress: 1,//进度条显示
    isFinish: false,//是否完成选项
    selList: [],
    myNature: {},
    selection:["A","B","C","D","E","F","G","H"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.page && options.page == "myTest"){

      this.setData({
        step: 3,
        myNature:JSON.parse(options.myNature)
      });
    }
    //从缓存中取出测试数据
    let testItem = wx.getStorageSync("testItem");
    if(testItem){
      wx.removeStorageSync("testItem");
      this.setData({
        testItem
      })
    }
  },
  
   //开始评测，监测是否登录
   onbtntesting(){
    if(!wx.getStorageSync("userInfo")){
      wx.showModal({
        title: '提示',
        content: '还未登录，是否前往登录？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            //存入当前url，登录完成后跳转此处
            wx.setStorageSync("navUrl", {"type": "tabbar", "url": "/pages/testPage/testPage"});
            wx.navigateTo({
              url: '/pages/login/login'
            });  
          }
        },
      });
      return;
    }

    //获取问题和选项
    request({
      url: "/test/getTestQues/" + this.data.testItem.id, 
      method: "GET", 
    }).then(res => { 
      let quesList = res.data.data;
      this.setData({
        quesList: quesList,
        currentQues: quesList[0],
        totalIndex: quesList.length
      })
      this.getTestAns(quesList[0].id);
    });
    //开启下一步
    this.setData({
      step: 2
    })
  },

  //加载选项
  getTestAns(qId){
    //查看answerList是否已存在此题选项
    let index = this.data.answerList.findIndex(item => item[0].qid == qId);
    if(index != -1){
      return;
    };
    request({
      url: "/test/getTestAns/" + qId, 
      method: "GET", 
    }).then(res => { 
      let answerList = this.data.answerList;
      answerList.push(res.data.data);
      this.setData({
        answerList
      })
    });
  },

  //记录问题选项选择状态
  onradioChange(e) {
    //如果列表中已有改选项则进行修改（不能直接移除，前端判定是根据顺序来的）
    let {sel} = e.currentTarget.dataset;
    let selList = this.data.selList;
    let index = selList.findIndex(item => item.qid == sel.qid);
    if(index != -1){
      selList[index] = {
        id: sel.id,
        qid: sel.qid,
        score: sel.score
      };
    }else{
      //保存本题选中
      //将本题的题号和得分存入得分列表
      selList.push({
        id: sel.id,
        qid: sel.qid,
        score: sel.score
      });
    }
    this.setData({
      selList
    })

    //加载下一题内容
    let currentIndex = this.data.currentIndex;//索引，1开始
    if (currentIndex < this.data.totalIndex) {//1<50,49<50
      
      let newQues = this.data.quesList[currentIndex];//下一题内容
      //加载该题选项
      this.getTestAns(newQues.id);//根据下一题id加载选项
      this.setData({
        currentIndex: currentIndex + 1,
        currentQues: newQues,
        progress: currentIndex / this.data.totalIndex * 100,
        isFinish: false
      })
    }else {
      this.setData({
        isFinish: true,
        progress: 100
      })
    } 
  },

  //查看上一题
  /**
   * 如何记录上一题的选择？根据存入选项的id匹配？并指定checked
   * selList，若当前的题目是quesList[2]
   * 那么当前currentIndex = 3（展示的是第三题）
   * 则上一题应该是第二题，也就是quesList[1]
   * 此时对应selList[1]
   * 可以查看上一题的前提是currentIndex>=2
   */
  onbtnpre() {
    let currentIndex = this.data.currentIndex;
    this.setData({
      currentQues: this.data.quesList[currentIndex - 2],
      currentIndex: currentIndex - 1,
      isFinish: false
    })
  },

  //提交并获取测试结果
  onbtnCom() {
    let userInfo = wx.getStorageSync("userInfo");
    request({
      url: "/test/getTestResult",
      method: "POST",
      data: {
        testId: this.data.testItem.id,
        selList: JSON.stringify(this.data.selList),
        userId: userInfo.id,
        userName: userInfo.nickname
      }
    }).then(res => {
      if(res.data.code == 200){
        this.setData({
          myNature:res.data.data,
          step: 3
        })
      }
    });

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