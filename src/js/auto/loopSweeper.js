import mineSweeper from '@/js/mineSweeper'

const loopSweeper = {
  startTime: 0,
  cost: 0,
  winTimes: 0,
  loseTimes: 0,
  total: 0,
  initOption: {},
  loopInterval: null,
  reset: true,
  costDom: document.getElementById('costTime'),
  totalDom: document.getElementById('total'),
  winDom: document.getElementById('win'),
  loseDom: document.getElementById('lose'),
  init(initOption) {
    this.reset = false
    this.total = 0
    this.initOption = initOption
    this.startTime = new Date()
    this.loopInterval = setInterval(() => {
      this.cost = ((new Date() - this.startTime) / 1000).toFixed(0)
      this.costDom.innerText = this.cost
    }, 1000)
    mineSweeper.initBoard(this.initOption)
  },
  getResult(res) {
    if (this.reset) return
    this.total++
    if (res === 'Succ') {
      this.winTimes++
    } else if (res === 'Fail') {
      this.loseTimes++
    }
    this.totalDom.innerText = this.total
    this.winDom.innerText = this.winTimes + ' / ' + ((this.winTimes / this.total) * 100).toFixed(0) + '%'
    this.loseDom.innerText = this.loseTimes + ' / ' + ((this.loseTimes / this.total) * 100).toFixed(0) + '%'
    mineSweeper.initBoard(this.initOption)
  },
  resetStatus() {
    this.reset = true
    this.costDom.innerText = this.cost = 0
    this.totalDom.innerText = this.total = 0
    this.winTimes = 0
    this.winDom.innerText = 0 + ' / 0%'
    this.loseTimes = 0
    this.loseDom.innerText = 0 + ' / 0%'
    clearInterval(this.loopInterval)
  }
}

export { loopSweeper }
