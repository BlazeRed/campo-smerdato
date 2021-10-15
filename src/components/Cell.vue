<template>
  <div v-bind:class="`minesweeper-cell ${getClass()}`">
    <div v-if="cell.isOpen && cell.bombCount">
      {{ cell.bombCount }}
    </div>
    <div v-if="cell.hasFlag">
      &#128169;
    </div>
  </div>
</template>

<style scoped>
.minesweeper-cell {
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border: 1px white solid;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  font-size: 1.3em;
  justify-content: center;
  min-height: 25px;
  min-width: 25px;
}

.bomb {
  background: #c0392b;
}

.open {
  background: rgba(0, 0, 0, 0.05);
}

.flag {
  background: #2ecc71;
}
</style>
<script>
export default {
  name: 'Cell',

  props: {
    cell: { type: Object, required: true }
  },

  data: () => ({}),

  methods: {
    getClass () {
      if (this.cell.isOpen && this.cell.hasBomb) {
        return 'bomb'
      }
      if (this.cell.isOpen) {
        return 'open'
      }
      if (this.cell.hasFlag) {
        return 'flag'
      }
      return ''
    }
  }
}
</script>
