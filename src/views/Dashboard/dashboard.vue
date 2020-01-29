<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <i class="iconfont-ali ali-jinrixiaoshoue"></i>
          <div class="content">
            <p class="title">总订单数</p>
            <p>102,400</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <i class="iconfont-ali ali-jinriorder"></i>
          <div class="content">
            <p class="title">总销售额</p>
            <p>102,400</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <i class="iconfont-ali ali-xiaoshoue"></i>
          <div class="content">
            <p class="title">今日订单数</p>
            <p>102,400</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <i class="iconfont-ali ali-dingdan"></i>
          <div class="content">
            <p class="title">今日销售额</p>
            <p>102,400</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div ref="mainReport" style="width:100%;height:400px; margin-top:50px;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: ""
    };
  },
  mounted() {
    //基于准备好的dom，初始化echarts实例
    const chart = this.$echarts.init(this.$refs.mainReport);
    //配置
    const option = {
      title: {
        text: "销售统计图"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      legend: {
        data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
        bottom:'5%'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "邮件营销",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "联盟广告",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: "视频广告",
          type: "line",
          stack: "总量",
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: "直接访问",
          type: "line",
          stack: "总量",
          areaStyle: { normal: {} },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "搜索引擎",
          type: "line",
          stack: "总量",
          label: {
            normal: {
              show: true,
              position: "top"
            }
          },
          areaStyle: { normal: {} },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    //使用
    chart.setOption(option);
  }
};
</script>

<style lang="less" scoped>
.dashboard {
  .bg-purple {
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 10px;
      color: #9a9696;
      p {
        margin: 0px;
        font-size: 14px;
        font-weight: bold;
      }
      .title {
        font-size: 16px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>