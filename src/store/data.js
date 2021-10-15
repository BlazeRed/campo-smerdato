const dataVuexModule = {
  state: {
    settings: {
      rows: 16,
      columns: 30,
      bombs: 99
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
