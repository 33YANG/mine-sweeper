import mineSweeper from '@/js/mineSweeper.js'
import '@/styles/index.less'

const diffModeDom = document.getElementById('diffMode')
const refreshBtnDom = document.getElementById('refresh')
const tipsDigDom = document.getElementById('tipsDig')
const tipsFlagDom = document.getElementById('tipsFlag')
const autoSweeperDom = document.getElementById('autoSweeper')
const debugMode = document.getElementById('debugMode')
const aiDelay = document.getElementById('aiDelay')
const loopSweeperDom = document.getElementById('loopSweeper')
const showChart = document.getElementById('showChart')

let show = true

const tipsInterval = setInterval(() => {
  if (show) {
    tipsDigDom.style.display = 'inline'
    tipsFlagDom.style.display = 'none'
  } else {
    tipsDigDom.style.display = 'none'
    tipsFlagDom.style.display = 'inline'
  }
  show = !show
}, 1500)

diffModeDom.addEventListener('change', () => {
  if (diffModeDom.value === 'Easy') {
    initOption.col = 11
    initOption.row = 7
    initOption.mineRate = 0.13
  } else if (diffModeDom.value === 'Medium') {
    initOption.col = 19
    initOption.row = 11
    initOption.mineRate = 0.16
  } else if (diffModeDom.value === 'Diffcult') {
    initOption.col = 35
    initOption.row = 17
    initOption.mineRate = 0.19
  } else {}
  if (loopSweeperDom.checked) {
    const changeEvent = new Event('change')
    loopSweeperDom.checked = false
    loopSweeperDom.dispatchEvent(changeEvent)
    mineSweeper.initBoard(initOption)
  } else if (autoSweeperDom.checked) {
    const changeEvent = new Event('change')
    autoSweeperDom.checked = false
    autoSweeperDom.dispatchEvent(changeEvent)
  } else {
    mineSweeper.initBoard(initOption)
  }
})

let initOption = {
  col: 19,
  row: 11,
  mineRate: 0.16,
  tipsInterval: tipsInterval,
  debugMode: false,
  isAutoSweeper: false,
  aiDelay: 0,
  isLoopSweeper: false,
}

autoSweeperDom.addEventListener('change', (event) => {
  initOption.isAutoSweeper = event.target.checked
  mineSweeper.initBoard(initOption)
})

debugMode.addEventListener('change', (event) => {
  initOption.debugMode = event.target.checked
  mineSweeper.initBoard(initOption)
})

aiDelay.addEventListener('change', (event) => {
  initOption.aiDelay = event.target.checked ? 1000 : 0
  mineSweeper.initBoard(initOption)
})

loopSweeperDom.addEventListener('change', (event) => {
  const loopInfo = document.getElementById('loopInfo')
  import(/* webpackChunkName: "loopSweeper" */ '@/js/auto/loopSweeper').then(({ loopSweeper }) => {
    if (event.target.checked) {
      initOption.isLoopSweeper = true
      initOption.isAutoSweeper = true
      loopInfo.style.display = 'block'
      autoSweeperDom.checked = true
      aiDelay.disabled = true
      loopSweeper.init(initOption)
    } else {
      initOption.isLoopSweeper = false
      initOption.isAutoSweeper = false
      autoSweeperDom.checked = false
      aiDelay.disabled = false
      loopSweeper.resetStatus()
      loopInfo.style.display = 'none'
    }
  })
})

showChart.addEventListener('change', (event) => {
  const chartDom = document.getElementById('charts')
  if (event.target.checked) {
    import(/* webpackChunkName: "mineRate" */ '@/js/chart/mineRate')
    chartDom.style.display = 'block'
  } else {
    chartDom.style.display = 'none'
  }
})

refreshBtnDom.addEventListener('click', () => {
  mineSweeper.initBoard(initOption)
})


mineSweeper.initBoard(initOption)
