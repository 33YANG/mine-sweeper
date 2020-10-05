import mineSweeper from '@/js/minesweeper.js'
import '@/styles/main.less'

const diffMode = document.getElementById('diffMode')
const tipsDig = document.getElementById('tipsDig')
const tipsFlag = document.getElementById('tipsFlag')
const refreshImg = document.getElementById('refreshImg')

diffMode.addEventListener('change', () => {
  if (diffMode.value === 'Easy') {
    mineSweeper.col = 11
    mineSweeper.row = 7
    mineSweeper.mineRate = 0.12
    tipsDig.style.height = '100px'
    tipsFlag.style.height = '100px'
  } else if (diffMode.value === 'Meduim') {
    mineSweeper.col = 19
    mineSweeper.row = 11
    mineSweeper.mineRate = 0.18
    tipsDig.style.height = '150px'
    tipsFlag.style.height = '150px'
  } else if (diffMode.value === 'Diffcult') {
    mineSweeper.col = 35
    mineSweeper.row = 17
    mineSweeper.mineRate = 0.26
    tipsDig.style.height = '220px'
    tipsFlag.style.height = '220px'
  } else {}
  mineSweeper.initBoard()
})

refreshImg.addEventListener('click', () => {
  mineSweeper.initBoard()
})

mineSweeper.initBoard()