<template>
  <v-container class="container bg-transparent">
    <v-card>
      <v-toolbar color="brown" dark flat text>
        <v-toolbar-title>Prova a non pestarla!</v-toolbar-title>
      </v-toolbar>
      <div row class="mt-3">
        <span>{{ bombCount }}</span>
        <v-btn v-on:click="initGrid" class="pa-1 mx-4 black--text" fab small>
          <h1>&#128169;</h1>
        </v-btn>
        <span>{{ displayTimer }}s</span>
      </div>
      <v-card-text>
        <div class="minesweeper-grid" v-bind:style="getGridStyle()">
          <Cell
            v-for="(cell, i) in grid"
            v-bind:key="i"
            v-bind:cell="cell"
            v-on:click.native="clickCell(cell, i)"
            v-on:click.right.native="addFlag(cell)"
            v-on:dblclick.native.prevent="doubleClick(cell, i)"
            v-on:contextmenu.native.prevent
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="brown" v-on:click="endGame()" dark>
          Non sopporto il tanfo
        </v-btn>
        <v-spacer/>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="won" max-width="45ch" persistent>
      <v-card class="won-card" max-height="30ch">
        <div col>
          <span class="won-celebration black--text">&#128169;</span>
          <div row>
            <v-spacer />
            <v-btn
              v-on:click="gotoRecord()"
              class="ma-2"
              color="brown"
              dark
            >
              Allora va... e flexa!
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="recordDialog" max-width="45ch" persistent>
      <v-card>
        <v-card-title><span class="brown--text">F</span>lexa</v-card-title>
        <v-card-text>
          <div row>
            <v-text-field v-model="nickname" label="Nome"/>
            <div class="font-weight-bold">{{ displayTimer }}<span class="brown--text">s</span></div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-on:click="initGrid()" text>Chiudi</v-btn>
          <v-btn v-on:click="saveRecord()" color="brown" dark>Salva</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.minesweeper-grid {
  user-select: none;
  position: relative;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(9, min-content);
  grid-auto-rows: min-content;
}

div[row] {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

div[col] {
  display: flex;
  flex-direction: column;
}

.won-card {
  background-image: url("~@/assets/confetti.gif");
  background-repeat: no-repeat;
  background-size: cover;
}

.won-celebration {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15ch;
}
</style>
<script>
import Cell from '../components/Cell'

export default {
  name: 'Minesweeper',

  components: { Cell },

  data: () => ({
    rows: undefined,
    cols: undefined,
    bombs: undefined,
    bombCount: 0,
    won: false,
    grid: [],
    stepOn: false,
    timer: undefined,
    displayTimer: 0,
    recordDialog: false,
    nickname: undefined,
    records: [],
    victorySong: new Audio('/celebration.mp3'),
    fart: new Audio('/fart.mp3')
  }),

  beforeMount () {
    const storeSettings = this.$store.getters.getSettings
    this.rows = storeSettings.rows
    this.cols = storeSettings.columns
    this.bombs = storeSettings.bombs
  },

  mounted () {
    this.initGrid()
    this.records = JSON.parse(localStorage.getItem('records') || '[]')
  },

  methods: {
    getGridStyle () {
      return `grid-template-columns: repeat(${this.cols}, 1fr);`
    },
    initGrid () {
      this.stopAudio()

      const size = this.rows * this.cols
      this.grid = []
      this.bombCount = this.bombs

      // Reset grid
      for (let i = 0; i < size; i += 1) {
        this.grid.push({
          hasBomb: false,
          isOpen: false,
          hasFlag: false,
          bombCount: 0,
          neighborhood: null
        })
      }

      // Add random bombs
      while (this.bombCount > 0) {
        const num = Math.floor(Math.random() * size)
        if (this.grid[num].hasBomb === false) {
          this.bombCount -= 1
          this.grid[num].hasBomb = true
        }
      }

      this.won = false
      this.stepOn = false
      this.bombCount = this.bombs
      this.recordDialog = false
      this.stopTimer()
      this.resetTimer()
    },
    haveWon () {
      const remainingBombCount = this.grid.reduce((acc, g) => {
        if (!g.isOpen) acc++
        return acc
      }, 0)

      const remainingGrid = this.grid.find(g => !g.isOpen && !g.hasFlag)

      if (!remainingGrid || remainingBombCount === this.bombs) {
        this.stepOn = true
        this.won = true
        this.stopTimer()

        // Start victory song
        this.victorySong.play()
      }
    },
    addFlag (cell) {
      if (this.stepOn || cell.isOpen) {
        return undefined
      }

      cell.hasFlag = !cell.hasFlag
      const flagCount = this.grid.reduce((accumulator, currentCell) => {
        if (currentCell.hasFlag) {
          return accumulator + 1
        }
        return accumulator
      }, 0)

      this.bombCount = this.bombs - flagCount
      this.haveWon()
    },
    doubleClick (cell, i) {
      if (this.stepOn || !cell.isOpen) {
        return undefined
      }

      this.setNeighborhood(cell, i)
      if (!cell.bombCount) {
        return undefined
      }

      let flagCount = 0
      cell.neighborhood.forEach((j) => {
        if (this.grid[j].hasFlag) {
          flagCount += 1
        }
      })

      if (flagCount === cell.bombCount) {
        this.checkNeighborhood(cell, true)
      }
    },
    clickCell (cell, i) {
      const cellClosed = this.grid.find(g => g.isOpen || g.hasFlag)

      if (!cellClosed) this.startTimer()

      if (this.stepOn || cell.hasFlag || cell.isOpen) {
        return undefined
      }

      if (cell.hasBomb) {
        this.grid.forEach((checkCell) => {
          if (checkCell.hasBomb) {
            checkCell.isOpen = true
          }
        })
        this.stepOn = true
        this.stopTimer()

        // Fart
        this.stopAudio()
        this.fart.play()

        return undefined
      }

      this.setNeighborhood(cell, i)
      cell.isOpen = true
      this.checkNeighborhood(cell)
      this.haveWon()
    },
    checkNeighborhood (cell, force) {
      if (cell.bombCount !== 0 && force !== true) {
        return undefined
      }

      cell.neighborhood.forEach((i) => {
        this.clickCell(this.grid[i], i)
      })
    },
    setNeighborhood (cell, i) {
      if (cell.neighborhood !== null) {
        return undefined
      }

      const neighborhood = []
      let bombCount = 0
      for (let x = -1; x < 2; x += 1) {
        for (let y = -1; y < 2; y += 1) {
          const cellIndex = this.getIndex(i, x, y)
          if (cellIndex !== false) {
            neighborhood.push(cellIndex)
            if (this.grid[cellIndex].hasBomb) {
              bombCount += 1
            }
          }
        }
      }

      cell.bombCount = bombCount
      cell.neighborhood = neighborhood
    },
    getIndex (i, x, y) {
      if (x === 0 && y === 0) {
        return false
      }

      if ((i % this.cols) + x < 0 || (i % this.cols) + x >= this.cols) {
        return false
      }

      if (Math.floor(i / this.cols) + y < 0 || Math.floor(i / this.cols) + y >= this.rows) {
        return false
      }

      return i + (y * this.cols + x)
    },
    startTimer () {
      this.timer = setInterval(() => { this.displayTimer++ }, 1000)
    },
    stopTimer () {
      clearInterval(this.timer)
    },
    resetTimer () {
      this.displayTimer = 0
    },
    endGame () {
      this.$router.push({ path: '/' })
    },
    saveRecord () {
      this.stopAudio()

      const newRecord = {
        name: this.nickname,
        time: this.displayTimer,
        conf: {
          h: this.rows,
          w: this.cols,
          b: this.bombs
        }
      }

      this.records.push(newRecord)
      localStorage.setItem('records', JSON.stringify(this.records))
      this.recordDialog = false
    },
    gotoRecord () {
      this.won = false
      this.recordDialog = true
    },
    stopAudio () {
      this.victorySong.pause()
      this.victorySong.currentTime = 0
      this.fart.pause()
      this.fart.currentTime = 0
    }
  }

}
</script>
