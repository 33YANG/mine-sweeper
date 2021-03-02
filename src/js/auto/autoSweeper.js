import mineSweeper from '@/js/mineSweeper'
import getLocationAround from '@/js/utils/common'

const autoSweeper = {
  col: 0,
  blocks: 0,
  blockIDs: '',
  mineNumber: 0,
  mineRate: 0,
  showAiFootprint: true,
  blocksBoard: [],
  unFullDoneBlocks: [], // 周围有cover状态的方块
  enableClick: [], // 当前判断出来的可以点击的方块集合
  rightEnableSet: new Set(),
  leftEnableSet: new Set(),
  clickCount: 0,
  markedCount: 0,
  unCoverCount: 0,
  debugMode: false,
  aiDelay: 0,
  getBoardInfo(info) {
    this.blocks = info.blocks
    this.mineRate = info.mineRate
    this.mineNumber = info.mineNumber
    this.blockIDs = info.blockIDs
    this.col = info.col
    this.debugMode = info.debugMode
    this.aiDelay = info.aiDelay
    if (this.debugMode) console.log('autoSweeper init, info:', info)
    this._initAiBoard()
    setTimeout(() => {
      this._sendClick(this._chooseFirstClick(), 'left')
    }, this.aiDelay)
  },
  _initAiBoard() {
    this.blocksBoard = []
    for (let i = 0; i < this.blocks; i++) {
      this.blocksBoard.push({
        value: 0,
        status: 'cover',
        mineRate: 0,
        fullDone: false,
        computed: false,
      })
    }
  },
  _sendClick(id, action) {
    const clickResult = mineSweeper.clickForAi(id, action) || []
    if (action === 'left') {
      this.clickCount++
      this.unCoverCount += clickResult.length
    } else {
      this.markedCount++
    }
    if (this.debugMode) {
      this._highlightAiClick(id, action)
    }
    if (clickResult[0] === 'BOOM') {
      console.log('Ai failed!!! BOOM index:', clickResult[1])
      if (this.debugMode) console.log('this.blocksBoard:', this.blocksBoard)
      return
    } else if (clickResult[0] === 'Succ') {
      console.log('Ai Won!!!')
      if (this.debugMode) console.log('Ai Win!!!')
      return
    } else {}
    this._handleFullDone(id, action)
    this._handleClickResult(clickResult) 
    this._computeClickItem()
    this._clickEnableBlock()
  },
  _clickEnableBlock() {
    // console.log('rightSet', this.rightEnableSet, 'leftSet', this.leftEnableSet)
    if (this.rightEnableSet.size > 0) {
      const firstIndex = [...this.rightEnableSet][0]
      this.rightEnableSet.delete(firstIndex)
      setTimeout(() => {
        this._sendClick(firstIndex, 'right')
      }, this.aiDelay) 
    } else if (this.leftEnableSet.size > 0) {
      const firstIndex = [...this.leftEnableSet][0]
      this.leftEnableSet.delete(firstIndex)
      setTimeout(() => {
        this._sendClick(firstIndex, 'left')
      }, this.aiDelay) 
    } else {
      const minRateBlockIndex = this._getMinRateBlock()
      if (this.debugMode) console.log('minRateBlockIndex:', minRateBlockIndex)
      if (minRateBlockIndex !== -1) {
        setTimeout(() => {
          this._sendClick(minRateBlockIndex, 'left')
        }, this.aiDelay)
      } else {
        console.log('minRateBlockIndex = -1')
      }
    }
  },
  _handleClickResult(clickResult) {
    clickResult.forEach(item => {
      this.blocksBoard[item.index].status = 'uncover'
      this.blocksBoard[item.index].mineRate = 0
      this.blocksBoard[item.index].value = item.value
      this.blocksBoard[item.index].computed = true
      this.blocksBoard[item.index].fullDone = item.value === 0 ? true : false
      if (this.rightEnableSet.has(item.index)) {
        this.rightEnableSet.delete(item.index)
      }
      if (this.leftEnableSet.has(item.index)) {
        this.leftEnableSet.delete(item.index)
      }
    })
  },
  _computeClickItem() {
    this.blocksBoard.forEach((item, index) => {
      if (item.status === 'uncover' && !item.fullDone) {

        const aroundResult = this._getAroundStatusNum(index)

        if (aroundResult.markedCount === 0) {
          if (aroundResult.coverCount === item.value) {
            aroundResult.coverIndex.forEach(i => {
              this.rightEnableSet.add(i)
            })
            this._handleFullDone(index, 'done')
          } else if (aroundResult.coverCount > item.value) {
            aroundResult.coverIndex.forEach(i => {
              const curMineRate = Number((item.value / aroundResult.coverCount).toFixed(3))
              if (curMineRate > this.blocksBoard[i].mineRate) {
                this.blocksBoard[i].mineRate = curMineRate
                this.blocksBoard[i].computed = true
              }
            })
          }
        } else if (aroundResult.markedCount === item.value) {
          aroundResult.coverIndex.forEach(i => {
            this.leftEnableSet.add(i)
          })
          this._handleFullDone(index, 'done')
        } else {  // marked个数小于value
          if (aroundResult.markedCount + aroundResult.coverCount === item.value) {
            aroundResult.coverIndex.forEach(i => {
              this.rightEnableSet.add(i)
            })
            this._handleFullDone(index, 'done')
          } else {  // marked个数和cover个数大于value
            aroundResult.coverIndex.forEach(i => {
              const curMineRate = Number(((item.value - aroundResult.markedCount) / aroundResult.coverCount).toFixed(3))
              if (curMineRate > this.blocksBoard[i].mineRate) {
                this.blocksBoard[i].mineRate = curMineRate
                this.blocksBoard[i].computed = true
              }
            })
          }
        }
      }
    })
  },
  _getMinRateBlock() {
    const allCoverRate = Number(((this.mineNumber - this.markedCount) / (this.blocks - this.markedCount - this.unCoverCount)).toFixed(3))
    let retIndex, rate
    for (let i = 0; i < this.blocksBoard.length; i++) {
      if (this.blocksBoard[i].status === 'cover') {
        if (!this.blocksBoard[i].computed) {
          this.blocksBoard[i].mineRate = allCoverRate
        }
      }
    }
    this.blocksBoard.forEach((item, index) => {
      if (item.status === 'cover') {
        rate = item.mineRate
        retIndex = index
        return
      }
    })
    if (retIndex !== undefined) {
      this.blocksBoard.forEach((item, index) => {
        if (item.status === 'cover') {
          if (item.mineRate < rate) {
            rate = item.mineRate
            retIndex = index
          }
        }
      })
      return retIndex
    } else {
      return -1
    }
  },
  _handleFullDone(index, action) {
    if (action === 'right') {
      this.blocksBoard[index].status = 'marked'
      this.blocksBoard[index].mineRate = 1
      this.blocksBoard[index].value = 'X'
      this.blocksBoard[index].fullDone = true
      this.blocksBoard[index].computed = true
    } else if (action === 'done') {
      this.blocksBoard[index].fullDone = true
      this.blocksBoard[index].computed = true
    } else {}
  },
  // 检查uncover方块周围还有几个cover的方块
  _getAroundStatusNum(id) {
    let ret = {
      coverCount: 0,
      coverIndex: [],
      markedCount: 0,
      markedIndex: [],
    }
    const around = getLocationAround(id, this.blocks, this.col)
    around.forEach(item => {
      if (this.blocksBoard[item].status === 'cover') {
        ret.coverCount++
        ret.coverIndex.push(item)
      } else if (this.blocksBoard[item].status === 'marked') {
        ret.markedCount++
        ret.markedIndex.push(item)
      }
    })
    if (ret.coverCount === around.length) {
      ret.coverCount = -1
    }
    return ret
  },
  // 检查方块周围是否fulldone，包括已确定的标记，和全部uncover
  _checkFullDone(id) {
    const around = getLocationAround(id, this.blocks, this.col)
    around.forEach(item => {
      if (this.blocksBoard[item].status === 'cover') return false
    })
    return true
  },
  _chooseFirstClick() {
    console.log('Good Luck with Ai ^_^')
    return Math.floor(Math.random() * (this.blocks - 1))
  },
  _highlightAiClick(id, direct) {
    if (!this.showAiFootprint) return
    const span = document.getElementById(this.blockIDs + id);
    if (direct === 'left') {
      span.classList.add('ai-left-click')
    } else if (direct === 'right') {
      span.classList.add('ai-right-click')
    } else {}
  },
}

export { autoSweeper }
