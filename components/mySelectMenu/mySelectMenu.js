// components/mySelectMenu/mySelectMenu.js
Component({
  /**
   * 组件的属性列表
   */
   properties: {
    // 导航文本
    dropDownMenuTitle: {
      type: Array,
      value: [],
    },

    //导航菜单的数据
    dropDownMenuWeatherData: {
      type: Array,
      value: []
    },
    dropDownMenuTypeData: {
      type: Array,
      value: []
    },
    dropDownMenuSelectionData: {
      type: Array,
      value: []
    },

  },
  data: {
    weather_open: false, // 天气
    type_open: false, // 类型
    preSelection_open:false,//已选

    // 景点信息

    shownavindex: '',//导航索引
  },
  methods: {
    // 点击后改变状态以及全局索引值
    tapWeatherNav: function(e) {
      if (this.data.weather_open) {
        this.getReset()
      } else {
        this.setData({
          weather_open: true,
          type_open: false,
          preSelection_open:false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    tapTypeNav: function(e) {
      if (this.data.type_open) {
        this.getReset()
        this.AttractionsChange()
      } else {
        this.setData({
          type_open: true,
          weather_open: false,
          preSelection_open:false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    tapSelectionNav: function(e) {
      if (this.data.preSelection_open) {
        this.getReset()
      } else {
        this.setData({
          weather_open: false,
          type_open: false,
          preSelection_open:true,
          shownavindex: e.currentTarget.dataset.nav
        })
      };
      console.log(this.properties.dropDownMenuSelectionData)
    },

    // 处理多选框 点击选择事件
    handleTypeItemChange(e){
      const {index} = e.target.dataset;
      // 点击后触发父页面方法 更改状态值
      this.triggerEvent("typeItemChange",{index})
    },
    
    // 重置导航
    getReset:function(){
      this.setData({
        weather_open: false,
        type_open: false,
        filter_open: false,
        preSelection_open:false,
        shownavindex: 0
      })
    },
    // 触发父页面的景点信息查询
    AttractionsChange(){
      this.triggerEvent("queryAttractions");
    },
    //调用路径规划方法
    getPlan(){
      this.triggerEvent("getPlan");
    },
    //预选景点的删除
    deleteSelection(e){
      const {att_id} = e.target.dataset;
      this.triggerEvent("deleteSelection",{att_id});
    }
  },
})
