import * as echarts from "echarts/lib/echarts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, TooltipComponent, LegendComponent, TitleComponent, BarChart, CanvasRenderer]);

const div = document.getElementById('charts')
div.style.height = '500px'
div.style.width = '900px'
const charts = echarts.init(div)
charts.setOption({
  title: {
    text: 'Mine Sweeper Rate Chart (19*11 Blocks)',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['Win Rate', 'Lose Rate'],
    left: 'right',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    name: 'Mine Rate (*100%)',
    nameLocation: 'center',
    nameGap: 25,
    type: 'category',
    data: [0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22],
  },
  yAxis: {
    name: 'Rate (*100%)',
    type: 'value',
  },
  series: [
    {
      name: 'Win Rate',
      type: 'bar',
      stack: 'Rate',
      label: {
        show: true,
        position: 'insideRight',
      },
      barWidth: '60%',
      data: [0.91, 0.84, 0.67, 0.48, 0.24, 0.11, 0.03],
      max: 1,
    },
    {
      name: 'Lose Rate',
      type: 'bar',
      stack: 'Rate',
      label: {
        show: true,
        position: 'insideRight',
      },
      data: [0.09, 0.16, 0.33, 0.52, 0.76, 0.89, 0.97],
      max: 1,
    },
  ],
})

