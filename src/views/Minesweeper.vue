<template>
  <v-container class="container" >
    <v-card class="card-width">
      <v-toolbar color="brown" dark flat text>
        <v-toolbar-title>Prova a non pestarla!</v-toolbar-title>
      </v-toolbar>
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
        <v-btn color="brown" v-on:click="endGame()" dark>Chiudi la partita</v-btn>
      </v-card-actions>
    </v-card>
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

.card-width {
  min-width: 70ch;
}

.minesweeper-grid {
  user-select: none;
  position: relative;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-auto-rows: 1fr;
}
</style>
<script>
import Cell from '../components/Cell.vue'

export default {
  name: 'Minesweeper',

  components: { Cell },

  data: () => ({
    rows: undefined,
    cols: undefined,
    bombs: undefined,
    bombCount: 0,
    won: false,
    grid: []
  }),

  beforeMount () {
    const storeSettings = this.$store.getters.getSettings
    this.rows = storeSettings.rows
    this.cols = storeSettings.columns
    this.bombs = storeSettings.bombs
  },

  mounted () {
    this.initGrid()
  },

  methods: {
    getGridStyle () {
      return `grid-template-columns: repeat(${this.cols}, 1fr);`
    },
    initGrid () {
      const size = this.rows * this.cols
      this.grid = []

      // Reset grid
      for (let i = 0; i < size; i += 1) {
        this.grid.push({
          hasBomb: false,
          isFree: false,
          hasFlag: false,
          bombCount: 0,
          neighborhood: null
        })
      }

      // Add random bombs
      while (this.bombs > 0) {
        const num = Math.floor(Math.random() * size)
        if (this.grid[num].hasBomb === false) {
          this.bombs -= 1
          this.grid[num].hasBomb = true
        }
      }

      this.won = false
      this.bombCount = this.bombs
    },
    haveWon () {
      if (this.bombCount !== 0) {
        return undefined
      }

      const remainingGrid = this.grid.find(g => !g.isFree && !g.hasFlag)
      if (!remainingGrid) {
        this.won = true
      }
    },
    addFlag (cell) {
      if (cell.isFree) {
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
      this.haveWeWon()
    },
    doubleClick (cell, i) {
      if (this.finished) {
        return undefined
      }

      if (cell.isFree === false) {
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
      if (this.finished) {
        return undefined
      }

      if (cell.hasFlag) {
        return undefined
      }

      if (cell.isFree) {
        return undefined
      }

      if (cell.hasBomb) {
        this.grid.forEach((checkCell) => {
          if (checkCell.hasBomb) {
            checkCell.isFree = true
          }
        })
        this.finished = true
        return undefined
      }

      this.setNeighborhood(cell, i)
      cell.isFree = true
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
    endGame () {
      this.$router.push({ path: '/' })
    }
  }

}
</script>
