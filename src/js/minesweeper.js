// import autoSweeper from '@/js/auto/autoSweeper'
import getLocationAround from '@/js/utils/common'

const mineSweeper = {
  initId: 'board', // 扫雷棋盘DOM节点
  mineSweeperBoard: '', // 所有小方块的父节点
  col: 19, // 列数
  row: 11, // 行数
  blocks: 0, // 总方块数
  mineRate: 0.16, // 雷与方块的比率
  mineNumber: 0, // 总雷数
  mineSweeperArray: [], // 存每个方块的雷与状态的数组
  mineArray: [], // 雷的索引
  blockIDs: 'block_', // 方块的id前缀字段
  clickedBlocks: 0, // 已点击的方块数
  markedBlocks: new Set(), // 已标记的方块数
  unCoveredBlocks: 0, // 已经不是覆盖状态的方块数
  clickTime: 0, // 第一次点击事件
  interval: null, // 间隔执行函数，用于清空间隔执行
  tipsInterval: null, // 页面提示图片的间隔函数，用于手动取消间隔
  debugMode: false, // debug模式是否开启，开启后会显示index与console等提示
  isAutoSweeper: false, // 是否开启自动扫雷
  aiDelay: 0, // 自动扫雷每步是否延迟
  isLoopSweeper: false, // 是否开启循环扫雷
  // 初始化扫雷棋盘
  initBoard(option) {
    const mineSweeperDom = document.getElementById('mineSweeper')
    const oldBoardDom = document.getElementById(this.initId)
    this.col = option.col
    this.row = option.row
    this.mineRate = option.mineRate
    // 每一次出初始化时删除原来的棋盘，新建一个
    mineSweeperDom.removeChild(oldBoardDom)
    const boardDom = document.createElement('section')
    boardDom.setAttribute('id', this.initId)
    mineSweeperDom.style.width = 40 * this.col + 'px'
    boardDom.style.width = 40 * this.col + 'px'
    boardDom.style.height = 40 * this.row + 'px'
    mineSweeperDom.appendChild(boardDom)

    this.mineSweeperBoard = boardDom
    this.blocks = this.col * this.row
    this.mineNumber = Math.floor(this.blocks * this.mineRate)
    this.clickedBlocks = 0
    this.unCoveredBlocks = 0
    this.markedBlocks = new Set()

    this.tipsInterval = option.tipsInterval
    this.debugMode = option.debugMode
    this.isAutoSweeper = option.isAutoSweeper
    this.aiDelay = option.aiDelay
    this.isLoopSweeper = option.isLoopSweeper

    const flagNum = document.getElementById('flagNum')
    flagNum.textContent = this.mineNumber
    const clockNum = document.getElementById('clockNum')
    clockNum.textContent = 0
    clearInterval(this.interval)

    this._initMine()
  },
  // 初始化地雷
  _initMine() {
    this.mineSweeperArray = new Array(this.blocks)
    // this.mineSweeperArray.fill(0)   fill的对象为引用类型，全部指向一个地址，换用for初始化
    for (let i = 0; i < this.mineSweeperArray.length; i++) {
      this.mineSweeperArray[i] = {
        status: 'cover',
        value: 0,
      }
    }
    this._generateMineBoard()
  },
  _generateMineBoard() {
    for (let i = 0; i < this.blocks; i++) {
      // 为每个方块添加不同颜色的遮罩
      const span = document.createElement('span')
      i % 2 === 0
        ? span.classList.add('odd-cover-color')
        : span.classList.add('even-cover-color')

      // 为每个方块生成id并且注册鼠标左击事件，左击即移除遮罩显示数字或者雷
      span.id = this.blockIDs + i

      // debug模式显示每个方块的索引
      if (this.debugMode) {
        const textSpan = document.createElement('i')
        textSpan.textContent = i
        textSpan.style.fontSize = 'small'
        textSpan.style.color = '#000'
        textSpan.style.marginBottom = '1.8rem'
        span.appendChild(textSpan)
      }

      // 将每个方块添加到扫雷棋盘中
      this.mineSweeperBoard.appendChild(span)
      span.addEventListener('click', () => {
        this._handleBlocksLeftClick(i)
      })

      // 注册鼠标右键点击事件
      span.addEventListener('contextmenu', (event) => {
        this._handleBlocksRightClick(event, i)
      })
    }
    // 如启动自动扫雷
    if (this.isAutoSweeper) {
      this.initAiSweeper()
    }
  },
  // 处理每一个位置的鼠标左键点击事件
  _handleBlocksLeftClick(index) {
    // 第一次点击的时候再初始化地雷，保证第一次点击不是雷
    if (this.clickedBlocks === 0) {
      const firstClickAround = getLocationAround(index, this.blocks, this.col)
      this.mineArray = this._getRandomNumber(
        this.blocks,
        this.mineNumber,
        firstClickAround
      )
      // 计算整个扫雷棋盘中每个位置周围9个方格的雷数
      for (let i = 0; i < this.blocks; i++) {
        let aroundArr = getLocationAround(i, this.blocks, this.col)
        for (let item of aroundArr) {
          if (this.mineArray.includes(item)) {
            this.mineSweeperArray[i].value++
          }
        }
      }
      // 初始化扫雷用时 每一秒循环加一
      this.clickTime = new Date()
      this.interval = setInterval(() => {
        this._setTimeInterval()
      }, 1000)
      // 移除顶部的图片提示
      this._removeTips()
    }

    if (this.mineSweeperArray[index].status !== 'cover') {
      return
    } else {
      this.clickedBlocks += 1
    }

    this._removeZeroMineCover(index)
  },
  // 处理每一个位置的鼠标右键点击事件
  _handleBlocksRightClick(event, index) {
    if (event) event.preventDefault()

    const curSpan = document.getElementById(this.blockIDs + index)

    if (
      this.mineSweeperArray[index].status === 'uncover' ||
      this.clickedBlocks === 0
    ) {
      // 已经翻开的方块右键点击时无动作 第一次右击无动作
      return
    } else if (this.mineSweeperArray[index].status === 'marked') {
      //已经标记的方块点击时取消标记
      if (index % 2 === 0) {
        curSpan.classList.remove('odd-marked-mine')
        curSpan.classList.add('odd-cover-color')
      } else {
        curSpan.classList.remove('even-marked-mine')
        curSpan.classList.add('even-cover-color')
      }
      this.markedBlocks.delete(index)
      this.mineSweeperArray[index].status = 'cover'
    } else {
      // 标记的旗数大于雷数时，操作无
      if (this.markedBlocks.size >= this.mineNumber) {
        return
      }
      if (index % 2 === 0) {
        curSpan.classList.remove('odd-cover-color')
        curSpan.classList.add('odd-marked-mine')
      } else {
        curSpan.classList.remove('even-cover-color')
        curSpan.classList.add('even-marked-mine')
      }
      this.markedBlocks.add(index)
      this.mineSweeperArray[index].status = 'marked'
      this._checkSuccess()
    }
    // 设置剩余的可插旗数
    const flagNum = document.getElementById('flagNum')
    flagNum.textContent = this.mineNumber - this.markedBlocks.size
  },
  // 移除数值为0的方块周围的方块的遮罩，并显示周围数值不为0和地雷的方块数值
  _removeZeroMineCover(index) {
    const curSpan = document.getElementById(this.blockIDs + index)
    if (this.mineSweeperArray[index].status !== 'cover') {
      return
    }
    index % 2 === 0
      ? curSpan.classList.remove('odd-cover-color')
      : curSpan.classList.remove('even-cover-color')
    this.mineSweeperArray[index].status = 'uncover'

    // 显示每个方块的周围雷数
    let spanText
    if (this.mineArray.includes(index)) {
      spanText = document.createTextNode('X')
    } else {
      spanText = document.createTextNode(this.mineSweeperArray[index].value)
    }
    // 为不同数字添加不同的显示颜色
    this._setDiffColor(curSpan, spanText.textContent)

    if (this.mineSweeperArray[index].value !== 0) {
      // 0数值不显示，其余数值显示雷数
      curSpan.appendChild(spanText)
    }

    // 处理点击到雷的情况
    if (this.mineArray.includes(index)) {
      this._showMessage('Fail')
      this._removeAllMineCover(index)
      //
      if (this.aiClickResult) {
        this.aiClickResult = ['BOOM', index]
      }
      return
    } else {
      //
      if (this.aiClickResult) {
        this.aiClickResult.push({
          index: index,
          value: this.mineSweeperArray[index].value,
        })
      }
    }

    // 如果0数值的周围还有0，则依次判断并同时移除其他0的遮罩，直到周围全是0以外的数值
    if (this.mineSweeperArray[index].value === 0) {
      let zeroArroundLocaArr = getLocationAround(index, this.blocks, this.col)
      zeroArroundLocaArr.forEach((arroundItem) => {
        if (index !== arroundItem) {
          this._removeZeroMineCover(arroundItem)
        }
      })
    }
    this.unCoveredBlocks += 1
    this._checkSuccess()
  },
  _removeAllMineCover(index) {
    clearInterval(this.interval)
    this.mineArray.forEach((item, ind) => {
      this.mineSweeperArray[item].status = 'uncover'
      const span = document.getElementById(this.blockIDs + item)
      if (index !== item) {
        setTimeout(() => {
          item % 2 === 0
            ? span.classList.remove('odd-cover-color')
            : span.classList.remove('even-cover-color')
          if (span.classList[0] === 'even-marked-mine') {
            span.classList.remove('even-marked-mine')
            span.classList.add('even-marked-uncover-mine')
            span.classList.add('mine')
          } else if (span.classList[0] === 'odd-marked-mine') {
            span.classList.remove('odd-marked-mine')
            span.classList.add('odd-marked-uncover-mine')
            span.classList.add('mine')
          } else {
            span.classList.add('boom')
          }
          span.appendChild(document.createTextNode('X'))
        }, 100 * ind)
      }
    })
  },
  _setDiffColor(curSpan, value) {
    if (value === '2') {
      curSpan.classList.add('two')
    } else if (value === '3') {
      curSpan.classList.add('three')
    } else if (value === '4') {
      curSpan.classList.add('four')
    } else if (value === '5') {
      curSpan.classList.add('five')
    } else if (value === 'X') {
      curSpan.classList.add('boom')
    } else {
    }
  },
  _removeTips() {
    clearInterval(this.tipsInterval)
    const tipsDig = document.getElementById('tipsDig')
    const tipsFlag = document.getElementById('tipsFlag')
    tipsDig.style.display = 'none'
    tipsFlag.style.display = 'none'
  },
  _setTimeInterval() {
    const clockNum = document.getElementById('clockNum')
    let intervalTime = Math.floor((new Date() - this.clickTime) / 1000)
    clockNum.textContent = intervalTime < 1000 ? intervalTime : 999
  },
  _checkSuccess() {
    if (
      this.unCoveredBlocks + this.markedBlocks.size === this.blocks &&
      this.markedBlocks.size === this.mineArray.length
    ) {
      for (let i = 0; i < this.markedBlocks.size; i++) {
        if (!this.markedBlocks.has(this.mineArray[i])) {
          return
        }
      }
      //
      if (this.aiClickResult) {
        this.aiClickResult = ['Succ']
      }
      this._showMessage('Succ')
      this._removeAllMineCover()
    }
  },
  // 获取随机数用户生成雷的位置
  _getRandomNumber(max, count, filter = []) {
    let randomNumArr = []
    while (count > 0) {
      let randomNum = Math.floor(Math.random() * max)
      if (!randomNumArr.includes(randomNum) && !filter.includes(randomNum)) {
        randomNumArr.push(randomNum)
        count--
      }
    }
    return randomNumArr
  },
  // 
  _showMessage(status) {
    if (this.isLoopSweeper) {
      import(/* webpackChunkName: "loopSweeper" */ '@/js/auto/loopSweeper').then(({ loopSweeper }) => {
        loopSweeper.getResult(status)
      })
    } else {
      const rightMsg = document.getElementById('rightMsg')
      const errorMsg = document.getElementById('errorMsg')
      const messageBox = document.getElementById('messageBox')
      messageBox.style.animationName = 'slidedown'
      messageBox.addEventListener('animationiteration', () => {
        messageBox.style.animationPlayState = 'paused'
        setTimeout(() => {
          messageBox.style.animationPlayState = 'running'
        }, 2000)
        setTimeout(() => {
          messageBox.style.animationName = ''
        }, 4000)
      }, false)
      if (status === 'Succ') {
        rightMsg.style.display = 'flex'
        errorMsg.style.display = 'none'
      } else if (status === 'Fail') {
        rightMsg.style.display = 'none'
        errorMsg.style.display = 'flex'
      }
    }
  },
  // auto sweeper 相关外部方法
  initAiSweeper() {
    const boardInfo = {
      col: this.col,
      blocks: this.blocks,
      mineNumber: this.mineNumber,
      mineRate: this.mineRate,
      blockIDs: this.blockIDs,
      debugMode: this.debugMode,
      aiDelay: this.aiDelay,
    }
    import(/* webpackChunkName: "autoSweeper" */ '@/js/auto/autoSweeper').then(({ autoSweeper }) => {
      autoSweeper.getBoardInfo(boardInfo)
    })
  },
  clickForAi(id, direct) {
    if (this.debugMode) console.log(`${direct} click for ai, id: ${id}`)
    if (id === undefined) return
    this.aiClickResult = []
    if (direct === 'left') {
      this._handleBlocksLeftClick(id)
    } else if (direct === 'right') {
      this._handleBlocksRightClick(null, id)
    } else {
    }
    return this.aiClickResult
  },
}

export default mineSweeper

