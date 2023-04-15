import Vue from 'vue'
import Router from 'vue-router'
import MenuView from '@/views/common/MenuView'
import PageView from '@/views/common/PageView'
import LoginView from '@/views/login/Common'
import EmptyPageView from '@/views/common/EmptyPageView'
//import HomePageView from '@/views/HomePage'
import HomePageView from '@/views/main/MainPage'
import db from 'utils/localstorage'
import request from 'utils/request'

// 解决点击重复路由报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

let constRouter = [
  {
    path: '/login',
    name: '登录页',
    component: LoginView
  },
  {
    path: '/index',
    name: '首页',
    redirect: '/main/MainPage'
  }
]

let router = new Router({
  routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  let token = db.get('USER_TOKEN')
  let user = db.get('USER')
  let userRouter = get('USER_ROUTER')
  if (token.length && user) {
    if (!asyncRouter) {
      if (!userRouter) {
        //登陆成功之后查询当前用户具备的菜单
        request.get(`api/v1/authMenu/queryVUERouterByUserName/${user.userName}`).then((res) => {
          let data  = res.data
          if(data && data.data){
            asyncRouter = data.data
            save('USER_ROUTER', asyncRouter)
            go(to, next)
          }
        })
      } else {
        asyncRouter = userRouter
        go(to, next)
      }
    } else {
      next()
    }
  } else {
    next('/login')
  }
})
function go (to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  //console.log(asyncRouter)
  //把路由放进router里面
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}
//保存数据到LocalStorage
function save (name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}
//从LocalStorage拿到数据
function get (name) {
  return JSON.parse(localStorage.getItem(name))
}
//过滤路由，进行动态显示
function filterAsyncRouter (routes) {
  return routes.filter((route) => {
    let component = route.component
    if (component) {
      switch (route.component) {
        case 'MenuView':
          route.component = MenuView
          break
        case 'PageView':
          route.component = PageView
          break
        case 'EmptyPageView':
          route.component = EmptyPageView
          break
        case 'HomePageView':
          route.component = HomePageView
          break
        default:
          route.component = view(component)
      }
      if (route.children != null && route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children)
      }else{

      }
      return true
    }
  })
}

function view (path) {
  return function (resolve) {
    import(`@/views/${path}.vue`).then(mod => {
      resolve(mod)
    })
  }
}
export default router
