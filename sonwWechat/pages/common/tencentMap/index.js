let laiyuanData = require('./../../../utils/laiyuan')
Component({
  /**
   * 使用全局样式属性
   */
  options: {
    // addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    markers: {
      type: Array,
      value: []
    }
  },
  /**
   * miniprogram-computed提供计算属性
   */
  computed: {
  },
  /**
   * 自带的监听器
   */
  observers: {
  },
  /**
   * miniprogram-computed提供监听器
   */
  watch: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    latitude: 39.357627,
    longitude: 114.702876,
    // markers: [],
    polygons: []
  },
  /*组件生命周期*/
  lifetimes: {
    created: function () {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached: function () {
      console.log("在组件实例进入页面节点树时执行")
    },
    ready: function () {
      console.log("在组件在视图层布局完成后执行")
      this.drawLine()
    },
    moved: function () {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached: function () {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error: function () {
      console.log("每当组件方法抛出错误时执行")
    }
  },
  /*组件所在页面的生命周期 */
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log("页面被展示")
    },
    hide: function () {
      // 页面被隐藏
      console.log("页面被隐藏")
    },
    resize: function (size) {
      // 页面尺寸变化
      console.log("页面尺寸变化")
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawLine(){
      console.log(laiyuanData)
      const allPoints = laiyuanData.laiyuan.features[0].geometry.coordinates[0][0]
      let points = []
      allPoints.map( (item, index) => {
        let point = {}
        point.longitude = item[0]
        point.latitude = item[1]
        points.push(point)
      })
      let laiyuan = {
        points: points,
        fillColor: "#ffff0033",
        strokeColor: "#FFF",
        strokeWidth: 2,
        zIndex: 1
      }
      let thisPolygons = []
      thisPolygons.push(laiyuan)
      this.setData({
        polygons:thisPolygons
      });
    }
  }
})
