const dataVuexModule = {
  state: {
    settings: {
      rows: 9,
      columns: 9,
      bombs: 10
    }
  },

  mutations: {
    setSettings: (state, settings) => {
      state.settings.rows = settings.rows
      state.settings.columns = settings.columns
      state.settings.bombs = settings.bombs
    }
  },

  getters: {
    getSettings: (state) => state.settings,
    getRows: (state) => state.settings.rows,
    getColumns: (state) => state.settings.columns,
    getBombs: (state) => state.settings.bombs
  }
}

export default dataVuexModule
