<template>
  <v-container class="container" >
    <v-card class="card-width">
      <v-toolbar color="primary" dark flat text>
        <v-toolbar-title>Campo smerdato 💩</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div row>
          <v-slider
            v-model="rows.val"
            v-bind:color="rows.color"
            v-bind:label="rows.label"
            v-bind:thumb-color="rows.color"
            v-bind:thumb-label="rowsPressed"
            v-bind:min="min"
            v-bind:max="max"
            v-on:mousedown="rowsPressed = true"
            v-on:mouseup="!rowsPressed"
          />
          <span>{{ rows.val }}</span>
        </div>
        <div row>
          <v-slider
            v-model="columns.val"
            v-bind:color="columns.color"
            v-bind:label="columns.label"
            v-bind:thumb-color="columns.color"
            v-bind:thumb-label="columnsPressed"
            v-bind:min="min"
            v-bind:max="max"
            v-on:mousedown="columnsPressed = true"
            v-on:mouseup="!columnsPressed"
          />
          <span>{{ columns.val }}</span>
        </div>
        <div row>
          <v-slider
            v-model="bombs.val"
            v-bind:color="bombs.color"
            v-bind:label="bombs.label"
            v-bind:thumb-color="bombs.color"
            v-bind:thumb-label="bombsPressed"
            v-bind:min="min"
            v-bind:max="maxBombs"
            v-on:mousedown="bombsPressed = true"
            v-on:mouseup="!bombsPressed"
          />
          <span>{{ bombs.val }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" v-on:click="startGame()">Gioca</v-btn>
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
  width: 70ch;
}

div[row] {
  display: flex;
  flex-direction: row;
  gap: 1em;
}
</style>

<script>
export default {
  name: 'Home',

  data: () => ({
    min: 1,
    max: 100,
    columnsPressed: false,
    rowsPressed: false,
    bombsPressed: false,
    rows: { label: 'Righe', val: 1, color: 'pink' },
    columns: { label: 'Colonne', val: 1, color: 'pink' },
    bombs: { label: 'Stronzi', val: 0, color: 'brown' }
  }),

  beforeMount () {
    const storeSettings = this.$store.getters.getSettings
    this.rows.val = storeSettings.rows
    this.columns.val = storeSettings.columns
    this.bombs.val = storeSettings.bombs
  },

  computed: {
    maxBombs () {
      return this.rows.val * this.columns.val - 1
    }
  },

  methods: {
    startGame () {
      const settings = {
        rows: this.rows.val,
        columns: this.columns.val,
        bombs: this.bombs.val
      }
      this.$store.commit('setSettings', settings)
    }
  }

}
</script>
