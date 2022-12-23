import * as echarts from './../ec-canvas/echarts';
const dayjs = require("dayjs");

const redColor = '#d72e29',
      orangeColor = '#fe9900',
      yellowColor = '#ffff01',
      blueColor = '#0060f3'
// pages/common/line/index.js
Component({
  properties: {
    chartsData:{
      type: Object,
      value:''
    },
    actionEle: {
      type: String,
      value: ''
    },
    liveTime: {
      type: Number,
      value: 0
    }
  },
  data: {
    ec: {
      // onInit: iiit,
      lazyLoad: true
    },
  },
  attached: function (options) {
    // console.log(this.data.chartsData)
    const thisTimne = dayjs(new Date()).format("HH:mm")
    // console.log(thisTimne)
  },
  ready: function () {
    if(this.data.chartsData){
      const myChartData  = this.data.chartsData
      this.initChart1(myChartData)
    }
    // console.log(this.data)
  },
  methods: {
    initChart1(myChartData) {
        const _this = this
        const stationId = myChartData.id
        const unit = myChartData.unit
        const xData = myChartData.charData.hdata
        const startTime = new Date(new Date().getFullYear() +'-'+ myChartData.datatime).getTime() - xData[xData.length-1] * 60 * 1000
        let yData = myChartData.charData.tdata
        let type = 'line'
        if(_this.data.actionEle === 'pre'){
            type = 'bar'
        }
        let yDataArr = myChartData.charData.tdata
        let yDataFxArr = myChartData.charData.m
        // console.log(yDataArr);
        yDataArr.map((item,index) => {
                // console.log(item);
            if(item > 999 & _this.data.actionEle != 'vis'){
                item = null
            }
            if(_this.data.actionEle === 'wind'){
                let thisJson = {
                    value: yDataArr[index],
                    symbolSize: 12,
                    itemStyle: {
                        color: _this.getColorByThreshold1(item, 0) //"blue"
                    },
                    symbol: 'path://M163 960L498.7 64l335.8 896-335.8-336',
                    // symbol: 'circle',
                    symbolRotate: yDataFxArr[index]
                }
                yDataArr[index] = thisJson
            }else{
                yDataArr[index] = item
                
                let thisJson = {
                    value: yDataArr[index],
                    // symbolSize: 12,
                    itemStyle: {
                        color: _this.getColorByThreshold1(item, 0) //"blue"
                    },
                    symbol: 'roundRect',
                    // symbolRotate: yDataFxArr[index]
                }
                yDataArr[index] = thisJson
            }


        })

        //获取实况时间点的下标（用于实况和预报颜色区分）
        const thisLiveTimeIndex = xData.map(item => item).indexOf(_this.data.liveTime)
        const thisPieces = _this.getColorListByThreshold
        _this.selectComponent('.mychart-dom-line').init((canvas, width, height) => {
          const chart = echarts.init(canvas, null, {
              width: width,
              height: height
          });
          
          let options = {
            title:{
                text: '',
            },
            grid:{
                top: 20,
                right: 20,
                bottom: 20
            },
            color: ['#e0e0e0'],
            tooltip:{},
            legend:{
                data:['']
            },
            dataZoom: {
                type: 'inside'
            },
            xAxis:{
                type: 'category',
                name: '分',
                nameGap: 4,
                nameTextStyle:{
                    color: '#467cc8',
                    fontSize: 10,
                    align: "center",
                    verticalAlign: "top"
                },
                // data:xData,
                data: xData.map((item) => {
                    let thisTxt = ''
                    if(new Date(item).getMinutes() === 0){
                        thisTxt = dayjs(new Date(item)).format("HH:mm")
                    }else{
                        thisTxt = dayjs(new Date(item)).format("mm")
                    }
                    return thisTxt
                }),
                axisLabel: {
                    textStyle: {
                        fontSize: 9
                    }
                },
                axisTick:{
                    show: false,
                },
                splitLine: {
                    show: true,
                    width: 1,
                    lineStyle: {
                        color: ['#efefef']
                    }
                }
            },
            yAxis:{
                name: unit,
                nameGap: 5,
                nameTextStyle:{
                    color: '#467cc8',
                    fontSize: 10,
                    align: "left",
                    verticalAlign: "right"
                },
                axisLabel:{
                    align: "center",
                    fontSize: 9,
                    color: '#666666'
                },
                axisTick:{
                    show: false,
                },
                splitLine: {
                    show: true,
                    width: 1,
                    lineStyle: {
                        color: ['#efefef']
                    }
                }
            },
            series:[{
                name:'',
                // sampling: 'average',//降采样策略
                // smooth: true,
                type:type,
                data:yData
            }],
            visualMap: {
              show: false,  //不显示区域图例
              dimension: 0,
              pieces: [
                {
                  gt: 0,
                  lte: thisLiveTimeIndex,
                  color: '#999999'
                },
                {
                  gt: thisLiveTimeIndex,
                  color: '#52eaeb'
                },
              ]
            }
          };
          chart.setOption(options);
          return chart;
      });
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
    getColorListByThreshold(){
      const thisEle = this.data.actionEle
      let thisBgColor = '#91cc75'
      let thisTxtColor = '#000000'
      const thisMonth = new Date().getMonth() + 1
      let thisArr = []
    //   [{ gte: 1.0, lte: 1.33, color: ‘#feff00’ }, { gte: 1.33, color: ‘#006622’}]
      switch (thisEle){
        case 'wind':
          thisArr = [{ gte: 4.0, lte: 10000, color: redColor }]
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
      return thisArr
    },
    getColorByThreshold1(val, type){
      const thisEle = this.data.actionEle
      let thisBgColor = '#91cc75'
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
  }
})