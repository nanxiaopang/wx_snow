import {request} from './../../utils/request'
const watch = require("./../../utils/watch");
const redColor = '#d72e29',
      orangeColor = '#fe9900',
      yellowColor = '#ffff01',
      blueColor = '#0060f3'
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    
    eleList: [
      {name: '风', value: 'wind'},
      {name: '气温', value: 'tem'},
      // {name: '湿度', value: 'humi'},
      {name: '降水', value: 'pre'},
      {name: '能见度', value: 'vis'},
      {name: '雪深', value: 'snowdepth'},
    ],

    actionEle: 'wind',
    liveTime: 0,
    echartsDataList: [],
    stationsList: [],
    markers: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    watch.setWatcher(this);
    // console.log(wx.canIUse('button.open-type.getUserInfo'))
    // wx.getUserProfile()
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      // console.log(this.canIUseGetUserProfile)
    }
    
    this.getNewestIndexDataFn()
  },
  onReady(){
    // let myStationList = []
    // console.log(this.stationsList)
    // this.stationsList.map((item, index) => {
    //   myStationList[index] = stationsList[index]
    //   myStationList[index].topV = this.getStationTop(item.value)
    //   myStationList[index].leftV = this.getStationLeft(item.value)
    // })
    // console.log(myStationList)
    // this.setData({
    //   stationList: myStationList
    // })
  },
  watch: {
    // 'actionEle'(newV, oldV){
    //   this.getNewestIndexDataFn()
    // }
  },
  getUserProfile1(){
    if(this.hasUserInfo){
      console.log('有用户信息')
    }else{
      console.log('没有用户信息')
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      console.log(e)
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  changeEle(e){
    // console.log(e.target.dataset.ele)
    this.setData({
      actionEle: e.target.dataset.ele
    })
    this.getNewestIndexDataFn()
    // console.log(this.data.actionEle)
  },
  
  getNewestIndexDataFn(){
    wx.showLoading({
      title: '加载中',
    })

    const _this = this
    request(
      {
        url: 'api/SnowTestPro/sk/getNewestIndexData',
        data:{
          ele: _this.data.actionEle
        }
      }
    ).then((result)=>{
      const myList = result.data.data1.data
      const thisLiveTime = result.data.data1.time
      const eleMax = result.data.data1.max
      myList.map( (item, index) => {
        myList[index].percent = _this.getPercent(item.value,eleMax)
        myList[index].valueColor = _this.getColorByThreshold(item.value, 1)
        myList[index].bgColor = _this.getColorByThreshold(item.value, 0)
      })
      
      let myList2 = result.data.data2.data
      let allPoints = []
      myList2.map((item, index) => {
        const point = {}
        point.id = index
        point.latitude = item.lat
        point.longitude = item.lon
        point.iconPath = "http://tywx.weatheryun.com/static/img/mark_r.png"
        point.width = 25
        point.height = 25
        point.name = item.name
        point.callout = {}
        point.callout.content = item.name
        point.callout.fontSize = 14
        point.callout.color = "#666666"
        point.callout.borderRadius = 2
        point.callout.display = "BYCLICK"
        allPoints.push(point)
      })

      const stationsList = result.data.data1.data
      
      stationsList.map((item, index) => {
        stationsList[index].topV = _this.getStationTop(item.id)
        stationsList[index].leftV = _this.getStationLeft(item.id)
      })
            
      console.log(stationsList)
      _this.setData({
        markers: allPoints
      })
      _this.setData({
        stationsList: stationsList
      })
      _this.setData({
        echartsDataList: []
      })
      _this.setData({
        echartsDataList: myList
      })
      _this.setData({
        liveTime: thisLiveTime
      })
      wx.hideLoading()
      console.log(_this.data.echartsDataList)
    })
  },
  getPercent(value,eleMax){
    let widthPercent = '0%'
    if(value && value != '-'){
      widthPercent = value/eleMax*100 + '%'
    }else{
      widthPercent = '0%'
    }
    return widthPercent
  },
  //根据当前要素阈值获取值应该设置的颜色
  //type:  0：返回背景颜色    1：返回文字颜色
  getColorByThreshold(val, type){
    const thisEle = this.data.actionEle
    let thisBgColor = ''
    let thisTxtColor = '#000000'
    const thisMonth = new Date().getMonth() + 1
    switch (thisEle){
      case 'wind':
        if(val > 4){
          thisBgColor = redColor
          thisTxtColor = '#ffffff'
        }
        break;
      case 'tem':
        if(thisMonth === 12 ||thisMonth === 2 || thisMonth === 2){
          if(val > 10){
            thisBgColor = orangeColor
            thisTxtColor = '#ffffff'
          }
        }else{
          if(val >= 35){
            thisBgColor = orangeColor
            thisTxtColor = '#ffffff'
          }
        }
        
        if(val <= -20){
          thisBgColor = blueColor
          thisTxtColor = '#ffffff'
        }
        break;
      case 'pre':
        if(thisMonth === 12 ||thisMonth === 2 || thisMonth === 2){
          if(val > 3){
            thisBgColor = redColor
            thisTxtColor = '#ffffff'
          }
        }else{
          
          if(val >= 20){
            thisBgColor = redColor
            thisTxtColor = '#ffffff'
          }
        }
        break;
      case 'vis':
        if(val <= 0.2){
          thisBgColor = redColor
          thisTxtColor = '#ffffff'
        }
        break;
      case 'snowdepth':
        if(val >= 3){
          thisBgColor = redColor
          thisTxtColor = '#ffffff'
        }
        break;
    }
    if(type === 0){
      return thisBgColor;
    }
    if(type === 1){
      return thisTxtColor;
    }
  },

  getStationTop(stationId){
      // let query = wx.createSelectorQuery();//创建节点查询器 query
      // const imgHeight = query.select('.live_img').height

      const imgWidth = wx.getSystemInfoSync().windowWidth
      const imgHeight = imgWidth/882*408
      // console.log(imgHeight)
      let thisStyle = ''
      switch (stationId){
        case 'B3017': //跳台山顶站
          thisStyle = 2/181.16 * imgHeight + 'px'
          break
        case 'B3018': //起跳点
          thisStyle = 40/181.16 * imgHeight + 'px'
          break
        case 'B3019': //超声风3
          thisStyle = 55/181.16 * imgHeight + 'px'
          break
        case 'B2236': //左侧山脊站
          thisStyle = 39/181.16 * imgHeight + 'px'
          break
        case 'B1637': //观景台
          thisStyle = 93/181.16 * imgHeight + 'px'
          break
        case 'B1630': //结束区
          thisStyle = 130/181.16 * imgHeight + 'px'
          break
        case 'B1629': //K点
          thisStyle = 90/181.16 * imgHeight + 'px'
          break
        case 'B1628': //超声风5
          thisStyle = 73/181.16 * imgHeight + 'px'
          break
        case 'B1627': //超声风4
          thisStyle = 69/181.16 * imgHeight + 'px'
          break
        case 'B1639': //超声风2
          thisStyle = 55/181.16 * imgHeight + 'px'
          break
      }
      return thisStyle
  },
  getStationLeft(stationId){
    // let query = wx.createSelectorQuery();//创建节点查询器 query
    // const imgWidth = query.select('.live_img').width
    const imgWidth = wx.getSystemInfoSync().windowWidth
    // console.log(1111)
    // console.log(imgWidth)
      let thisStyle = ''
      switch (stationId){
        case 'B3017': //跳台山顶站
          thisStyle = 310/365 * imgWidth + 'px'
          break
        case 'B3018': //起跳点
          thisStyle = 226/365 * imgWidth + 'px'
          break
        case 'B3019': //超声风3
          thisStyle = 203/365 * imgWidth + 'px'
          break
        case 'B2236': //左侧山脊站
          thisStyle = 13/365 * imgWidth + 'px'
          break
        case 'B1637': //观景台
          thisStyle = 80/365 * imgWidth + 'px'
          break
        case 'B1630': //结束区
          thisStyle = 183/365 * imgWidth + 'px'
          break
        case 'B1629': //K点
          thisStyle = 224/365 * imgWidth + 'px'
          break
        case 'B1628': //超声风5
          thisStyle = 187/365 * imgWidth + 'px'
          break
        case 'B1627': //超声风4
          thisStyle = 239/365 * imgWidth + 'px'
          break
        case 'B1639': //超声风2
          thisStyle = 248/365 * imgWidth + 'px'
          break
      }
      return thisStyle
  },
})
