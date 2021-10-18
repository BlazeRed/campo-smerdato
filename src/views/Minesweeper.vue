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
      const grid = []

      for (let i = 0; i < size; i += 1) {
        grid.push({
          hasBomb: false,
          isFree: false,
          hasFlag: false,
          bombCount: 0,
          neighborhood: null
        })
      }

      while (this.bombs > 0) {
        const num = Math.floor(Math.random() * size)
        if (grid[num].hasBomb === false) {
          this.bombs -= 1
          grid[num].hasBomb = true
        }
      }

      this.grid = grid
      this.won = false
      this.bombCount = this.bombs
    },
    haveWeWon () {
      if (this.bombCount !== 0) {
        return
      }
      const remainingGrid = this.grid.find(g => !g.isFree && !g.hasFlag)
      if (!remainingGrid) {
        this.won = true
      }
    },
    addFlag (cell) {
      if (cell.isFree) {
        return
      }
      cell.hasFlag = !cell.hasFlag

      const flagCount = this.grid.reduce((accumulator, currentValue) => {
        if (currentValue.hasFlag) {
          return accumulator + 1
        }
        return accumulator
      }, 0)

      this.bombCount = this.bombs - flagCount
      this.haveWeWon()
    },
    endGame () {
      this.$router.push({ path: '/' })
    }
  }

}
</script>
