<template>
  <div v-bind:class="`minesweeper-cell ${getClass()}`">
    <div v-if="cell.isOpen && cell.bombCount">
      {{ cell.bombCount }}
    </div>
    <div v-if="cell.isOpen && cell.hasBomb">
      &#128169;
    </div>
  </div>
</template>

<style scoped>
.minesweeper-cell {
  align-items: center;
  background: #98bf2c;
  border: 1px white solid;
  color: #4f342f;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  font-size: 1.3em;
  justify-content: center;
  height: 26px;
  width: 26px;
}

.bomb {
  background: #98bf2c2a;
}

.open {
  background: #98bf2c2a;
}

.flag::before {
  content: '🪰';
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
