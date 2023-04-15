import db from 'utils/localstorage'

export default {
  namespaced: true,
  state: {
    sidebar: {
      opened: true
    },
    settingBar: {
      opened: false
    },
    isMobile: false,
    theme: db.get('THEME', 'light'),
    layout: db.get('LAYOUT', 'side'),
    systemName: '志愿者服务管理系统',
    //copyright: `${new Date().getFullYear()} <a href="https://www.skywalking.pro" target="_blank">养老驿站</a>`,
    copyright: ``,
    multiPage: getBooleanValue(db.get('MULTI_PAGE'), true),
    fixSideBar: getBooleanValue(db.get('FIX_SIDEBAR'), true),
    fixHeader: getBooleanValue(db.get('FIX_HEADER'), true),
    colorList: [
      'rgb(245, 34, 45)',
      'rgb(250, 84, 28)',
      'rgb(250, 173, 20)',
      'rgb(66, 185, 131)',
      'rgb(82, 196, 26)',
      'rgb(24, 144, 255)',
      'rgb(47, 84, 235)',
      'rgb(114, 46, 209)'
    ],
    color: db.get('COLOR', 'rgb(24, 144, 255)')
  },
  mutations: {
    setDevice (state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme (state, theme) {
      db.save('THEME', theme)
      state.theme = theme
    },
    setLayout (state, layout) {
      db.save('LAYOUT', layout)
      state.layout = layout
    },
    setMultiPage (state, multiPage) {
      db.save('MULTI_PAGE', multiPage)
      state.multiPage = multiPage
    },
    setSidebar (state, type) {
      state.sidebar.opened = type
    },
    fixSideBar (state, flag) {
      db.save('FIX_SIDEBAR', flag)
      state.fixSideBar = flag
    },
    fixHeader (state, flag) {
      db.save('FIX_HEADER', flag)
      state.fixHeader = flag
    },
    setSettingBar (state, flag) {
      state.settingBar.opened = flag
    },
    setColor (state, color) {
      db.save('COLOR', color)
      state.color = color
    }
  }
}

function getBooleanValue (value, defaultValue) {
  if (Object.is(value, null)) {
    return defaultValue
  }
  if (JSON.stringify(value) !== '{}') {
    return value
  } else {
    return false
  }
}
