export class bjlLibTool {
  constructor() {
    this.maxheight = 120
    this.maxLen = 0
    this.layout = []
    this.dataTable = []
    this.curCol = 0
    this.curlayoutCol = 0
    this.curRow = 0
    this.beforeVal = null
    this.m_space = 12
    this.type = 0
    this.lastindex = 0
    this.lastpos = { x: 0, y: 0 }
  }

  static getInstance() {
    return new bjlLibTool()
  }

  initNode(space, type) {
    this.m_space = space
    this.type = type
  }

  init(str) {
    const data = this.dataSource(str)
    let ping = 0

    this.lastindex = str.length - 1
    this.layout = []
    this.dataTable = []

    for (let i = 0; i < str.length; i++) {
      this.layout[i] = []
      this.dataTable[i] = []
    }

    data.forEach((val, index) => {
      if ('abcd'.includes(val)) {
        this.checkVal(val, index)
        this.beforeVal = 'a'
        checkPing(this)
      } else if ('efgh'.includes(val)) {
        this.checkVal(val, index)
        this.beforeVal = 'e'
        checkPing(this)
      } else if ('ijkl'.includes(val)) {
        const cell = this.layout[this.lastpos.x]?.[this.lastpos.y]
        if (cell) cell.ping = (cell.ping || 0) + 1
        ping++
      }
    })

    function checkPing(_that) {
      if (ping !== 0 && _that.layout[0]?.length === 1 && !_that.layout[1]?.length) {
        _that.layout[0][0].ping = ping
      } else {
        ping = 0
      }
    }
  }

  checkType(val) {
    const idx = 'abcdefgh'.indexOf(val)
    if (idx >= 0 && idx <= 3) return 'a'
    if (idx >= 4 && idx <= 7) return 'e'
    return false
  }

  checkVal(val, index) {
    let { curCol, curRow } = this
    const type = this.checkType(val)

    if (type && type === this.beforeVal) {
      this.dataTable[curCol].push(val)

      if (curRow >= this.maxLen) {
        const offset = this.dataTable[curCol].length - this.maxLen - 1
        curCol += offset
        curRow = 0
      } else {
        curRow++
      }
    } else {
      curRow = 0
      curCol++
      this.maxLen = this.getMaxPos(this.layout[curCol] || [])
      this.dataTable[curCol][curRow] = val
    }

    this.layout[curCol] ||= []
    this.layout[curCol][curRow] = { value: val, ping: 0, index }

    this.curCol = curCol
    this.curRow = curRow
    this.lastpos = { x: curCol, y: curRow }

    return {
      val,
      position: { x: curCol * this.m_space, y: curRow * this.m_space }
    }
  }

  getMaxPos(arr) {
    let len = 5
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        len = i
        break
      }
    }
    return len
  }

  dataSource(str) {
    return str.split('')
  }

  /** type: 1 大眼路 | 2 小路 | 3 曱甴路 */
  getLuTu(type, bjl) {
    return new LuTuMap(type).init(bjl.dataTable, bjl.layout)
  }

  getLastCell() {
    let target = null
    this.layout.flat().forEach(item => {
      if (item?.index === this.lastindex) {
        item.islast = true
        target = item
      }
    })
    return target
  }

  getlayOut() {
    const empty = { value: '', ping: null, index: null }
    return this.layout.map(col =>
      col.map(cell => cell || empty)
    )
  }
}

export class LuTuMap {
  constructor(step) {
    this.dataTable = []
    this.layout = []
    this.str = ''
    this.step = step
  }

  init(dataTable, layout) {
    this.dataTable = dataTable.filter(col => col.length)
    this.layout = layout

    this.dataTable.forEach((col, x) => {
      if (x >= this.step) {
        col.forEach((_, y) => {
          if (!(x === this.step && y === 0)) {
            this.checkRoadType(x, y)
          }
        })
      }
    })
    return this.str
  }

  checkRoadType(x, y) {
    if (y > 0 && this.dataTable[x].length > 1) {
      this.getResult(x, y, true)
    } else if (y === 0) {
      this.getResult(x, y, false)
    }
  }

  getResult(x, y, mid) {
    if (mid) {
      this.str += this.isHas(x, y) || this.isZhiLuo(x, y) ? 'a' : 'e'
    } else {
      const prevLen = this.dataTable[x - 1].length
      this.str += this.isAlign(x - 1, prevLen) ? 'a' : 'e'
    }
  }

  isZhiLuo(x, y) {
    return !this.isHas(x, y) && !this.isHas(x, y - 1)
  }

  isHas(x, y) {
    return !!this.dataTable[x - this.step]?.[y]
  }

  isAlign(x, y) {
    return this.getMaxPos(this.dataTable[x]) === this.getMaxPos(this.dataTable[x - this.step])
  }

  getMaxPos(arr) {
    let len = 5
    if (arr.length) {
      const base = this.checkType(arr[0])
      for (let i = 0; i < arr.length; i++) {
        if (this.checkType(arr[i]) === base) len = i
        else break
      }
    }
    return len
  }

  checkType(val) {
    const idx = 'abcdefgh'.indexOf(val)
    if (idx <= 3) return 'a'
    if (idx <= 7) return 'e'
    return false
  }
}
