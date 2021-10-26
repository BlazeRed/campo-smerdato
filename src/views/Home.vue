<template>
  <v-container class="container" >
    <v-card class="card-width">
      <v-toolbar color="brown" dark flat text>
        <v-toolbar-title>Campo smerdato</v-toolbar-title>
        <v-spacer />
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on:click="showRecords = true"
              v-bind="attrs"
              v-on="on"
              class="pa-4"
              color="brown darken-3"
              fab
              small
            >
              <h1>&#128046;</h1>
            </v-btn>
          </template>
          <span>Flex</span>
        </v-tooltip>
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
            v-bind:max="maxRows"
            v-on:mousedown="rowsPressed = true"
            v-on:mouseup="!rowsPressed"
            track-color="blue-grey lighten-4"
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
            v-bind:max="maxCols"
            v-on:mousedown="columnsPressed = true"
            v-on:mouseup="!columnsPressed"
            track-color="blue-grey lighten-4"
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
            v-bind:min="10"
            v-bind:max="maxBombs"
            v-on:mousedown="bombsPressed = true"
            v-on:mouseup="!bombsPressed"
            track-color="blue-grey lighten-4"
          >
            <template v-slot:label>
              <span class="black--text" >&#128169;</span>
            </template>
          </v-slider>
          <span>{{ bombs.val }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="brown" v-on:click="startGame()" dark>Gioca</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showRecords" max-width="42ch" persistent scrollable>
      <v-card class="record-height">
        <v-card-title>Ecco i record merdosi</v-card-title>
        <v-card-text>
          <span v-if="records.length <= 0">Nessuno ha fatto abbastanza schifo.</span>
          <v-data-table
            v-bind:headers="headers"
            v-bind:items="records"
            v-bind:items-per-page="-1"
            v-bind:sort-by="['time']"
            v-bind:sort-desc="[true]"
            hide-default-footer
          >
            <template slot="item.time" slot-scope="{ item }">
              {{ item.time }}s
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="pa-2">
          <v-spacer />
          <v-btn v-on:click="showRecords = false" color="brown" dark>Chiudi</v-btn>
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

.card-width {
  width: 70ch;
}

.record-height {
  height: 42ch;
  overflow: hidden;
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
    min: 9,
    maxRows: 24,
    maxCols: 30,
    columnsPressed: false,
    rowsPressed: false,
    bombsPressed: false,
    rows: { label: 'Righe', val: 1, color: 'blue-grey' },
    columns: { label: 'Colonne', val: 1, color: 'blue-grey' },
    bombs: { label: '', val: 0, color: 'brown' },
    headers: [
      { text: 'Nome', align: 'start', sortable: false, value: 'name' },
      { text: 'Record', align: 'end', sortable: false, value: 'time' }
    ],
    records: [],
    showRecords: false
  }),

  beforeMount () {
    const storeSettings = this.$store.getters.getSettings
    this.rows.val = storeSettings.rows
    this.columns.val = storeSettings.columns
    this.bombs.val = storeSettings.bombs
  },

  mounted () {
    this.records = JSON.parse(localStorage.getItem('records') || '[]')
  },

  computed: {
    maxBombs () {
      return this.rows.val * this.columns.val - 10
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
      this.$router.push({ path: '/campo-smerdato' })
    }
  }

}
</script>
