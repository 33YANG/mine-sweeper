const mineSweeper = {
  initId: 'board',
  mineSweeperBoard: '', //扫雷棋盘DOM节点
  col: 19, // 列数
  row: 11, // 行数
  blocks: 0, // 总方块数
  mineRate: 0.18, // 雷与方块的比率
  mineNumber: 0, // 总雷数
  mineSweeperArray: [], // 存每个方块的雷与状态的数据
  mineArray: [], // 雷的索引
  blockIDs: 'block_', // 方块的id前缀字段
  clickedBlocks: 0, // 已点击的方块数
  markedBlocks: new Set(), // 已标记的方块数
  uncoveredBlocks: 0, // 以及不是覆盖状态的方块数
  clickTime: 0, // 第一次点击时间
  _interval: null, //间隔执行函数，用户清空间隔执行
  //初始化扫雷棋盘
  initBoard() {
    const mineSweeperDom = document.getElementById('mineSweeper')
    const oldBoardDom = document.getElementById('board')
    // 每一次初始化时删除原来的棋盘，新建一个
    mineSweeperDom.removeChild(oldBoardDom)
    const boardDom = document.createElement('section')
    boardDom.setAttribute('id', 'board')
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
    const flagNum = document.getElementById('flagNum')
    flagNum.textContent = this.mineNumber
    const clockNum = document.getElementById('clockNum')
    clockNum.textContent = 0
    clearInterval(this._interval)

    this._initMine()
  },
  //初始化地雷
  _initMine() {
    this.mineSweeperArray = new Array(this.blocks)
    // this.mineSweeperArray.fill(0) fill的对象为引用类型，全部指向一个地址，换用for初始化
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
      i % 2 === 0 ? span.classList.add('odd-cover-color') : span.classList.add('even-cover-color')
      // 为每个方块生成id并且注册鼠标左击事件，左击即移除遮罩显示数字或雷
      span.id = this.blockIDs + i
      // 将每个方块添加到扫雷棋盘中
      this.mineSweeperBoard.appendChild(span)
      span.addEventListener('click', () => {
        this._handleBlocksLeftClick(span.id)
      })
      // 注册鼠标右键点击事件
      span.addEventListener('contextmenu', (event) => {
        this._handleBlocksRightClick(event, span.id)
      })
    }
  },
  // 处理每一个位置的鼠标左键点击事件
  _handleBlocksLeftClick(blockID) {
    const index = Number(blockID.slice(6))
    const curSpan = document.getElementById(blockID)
    // 第一次点击的时候再初始化地雷，确保第一次点击不会是雷
    if (this.clickedBlocks === 0) {
      const firstClickAround = this._getLocationAround(index)
      this.mineArray = this._getRandomNumber(this.blocks, this.mineNumber, firstClickAround)
      // 计算整个扫雷棋盘中每个位置周围9个方格的雷数
      for (let i = 0; i < this.blocks; i++) {
        let aroundArr = this._getLocationAround(i)
        for (let item of aroundArr) {
          if (this.mineArray.includes(item)) {
            this.mineSweeperArray[i].value++
          }
        }
      }
      this.clickTime = new Date()
      this._interval = setInterval(() => {
        this._setTimeInterval()
      }, 1000)
      this._removeTips()
    }

    if (this.mineSweeperArray[index].status !== 'cover') {
      return
    } else {
      this.clickedBlocks += 1
    }

    this._removeZeroMineCover(index)
  },
  _handleBlocksRightClick(event, blockID) {
    event.preventDefault()

    const curSpan = document.getElementById(blockID)
    const index = Number(blockID.slice(6))

    if (this.mineSweeperArray[index].status === 'uncover' || this.clickedBlocks === 0) {
      // 已经翻开的方块右键点击时无动作 第一次右击也无动作
      return
    } else if (this.mineSweeperArray[index].status === 'marked') {
      //  以及标记的方块点击时取消标记
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
    index % 2 === 0 ? curSpan.classList.remove('odd-cover-color') : curSpan.classList.remove('even-cover-color')
    this.mineSweeperArray[index].status = 'uncover'
    // 显示每个方块的周围雷数
    let spanText
    if (this.mineArray.includes(index)) {
      spanText = document.createTextNode('X')
    } else {
      spanText = document.createTextNode(this.mineSweeperArray[index].value)
    }
    // 为不同的数字添加不同的显示颜色
    this._setDiffColor(curSpan, spanText.textContent)

    if (this.mineSweeperArray[index].value !== 0) {
      // 0数值不显示，其余数值显示具体雷数
      curSpan.appendChild(spanText)
    }
    //处理点击到雷的情况
    if (this.mineArray.includes(index)) {
      alert('BOOM!!!  Σ( ° △ °|||)︴')
      this._removeAllMineCover(index)
    }
    // 如果0数值周围还有0，则依次判断并同时移除其他0的遮罩，直到周围全是0以外的数值
    if (this.mineSweeperArray[index].value === 0) {
      let zeroArroundLocalArr = this._getLocationAround(index)
      zeroArroundLocalArr.forEach((arroundItem) => {
        if (index !== arroundItem) {
          this._removeZeroMineCover(arroundItem)
        }
      })
    }
    this.unCoveredBlocks += 1
    this._checkSuccess()
  },
  _removeAllMineCover(index) {
    clearInterval(this._interval)

    this.mineArray.forEach((item, ind) => {
      this.mineSweeperArray[item].status = 'uncover'
      const span = document.getElementById(this.blockIDs + item)
      if (index !== item) {
        setTimeout(() => {
          console.log('item =', item, 'ind =', ind, 'index =', index)
          item % 2 === 0 ? span.classList.remove('odd-cover-color') : span.classList.remove('even-cover-color')
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
    clearInterval(tipsInterval)
    const tipsDig = document.getElementById('tipsDig')
    const tipsFlag = document.getElementById('tipsFlag')
    tipsDig.style.display = 'none'
    tipsFlag.style.display = 'none'
  },
  _setTimeInterval() {
    const clockNum = document.getElementById('clockNum')
    const intervalTime = Math.floor((new Date() - this.clickTime) / 1000)
    clockNum.textContent = intervalTime < 1000 ? intervalTime : 999
  },
  _checkSuccess() {
    if (this.unCoveredBlocks + this.markedBlocks.size === this.blocks && this.markedBlocks.size === this.mineArray.length) {
      for (let i = 0; i < this.markedBlocks.size; i++) {
        if (!this.markedBlocks.has(this.mineArray[i])) {
          return
        }
      }
      alert('Congratulation!!! (*^v^*) (p≥v≤q) (⌒▽⌒)')
      this._removeAllMineCover()
    }
  },
  // 获取数据数用于生成雷的位置
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
  // 获得每一个位置的周围9个位置的索引，组合成数组返回
  _getLocationAround(location) {
    let aroundArr = [location]
    if (location === 0) {
      //左上角
      aroundArr.push(...[location + 1, location + this.col, location + this.col + 1])
    } else if (location === this.col - 1) {
      //右上角
      aroundArr.push(...[location - 1, location + this.col, location + this.col - 1])
    } else if (location === this.blocks - this.col) {
      //左下角
      aroundArr.push(...[location + 1, location - this.col, location - this.col + 1])
    } else if (location === this.blocks - 1) {
      //右下角
      aroundArr.push(...[location - 1, location - this.col, location - this.col - 1])
    } else if (location > 0 && location < this.col - 1) {
      //顶边
      aroundArr.push(...[location - 1, location + 1, location + this.col, location + this.col - 1, location + this.col + 1])
    } else if (location > this.blocks - this.col && location < this.blocks - 1) {
      //底边
      aroundArr.push(...[location - 1, location + 1, location - this.col, location - this.col - 1, location - this.col + 1])
    } else if (location % this.col === 0) {
      //左边
      aroundArr.push(...[location + 1, location - this.col, location - this.col + 1, location + this.col, location + this.col + 1])
    } else if ((location + 1) % this.col === 0) {
      //右边
      aroundArr.push(...[location - 1, location - this.col, location - this.col - 1, location + this.col, location + this.col - 1])
    } else {
      //
      aroundArr.push(
        ...[
          location - 1,
          location + 1,
          location + this.col,
          location - this.col,
          location - this.col - 1,
          location - this.col + 1,
          location + this.col - 1,
          location + this.col + 1,
        ]
      )
    }
    return aroundArr
  },
}

const tipsDig = document.getElementById('tipsDig')
const tipsFlag = document.getElementById('tipsFlag')

let show = true

const tipsInterval = setInterval(() => {
  if (show) {
    tipsDig.style.display = 'inline'
    tipsFlag.style.display = 'none'
  } else {
    tipsDig.style.display = 'none'
    tipsFlag.style.display = 'inline'
  }
  show = !show
}, 1500)

export default mineSweeper
