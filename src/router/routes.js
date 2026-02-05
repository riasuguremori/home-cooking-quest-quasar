const routes = [
  {
    path: '/',
    component: () => import('layouts/defaultLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          title: '首頁',
        },
      },
      {
        path: 'userProfile',
        component: () => import('pages/profilePage.vue'),
        meta: {
          title: '會員中心',
        },
      },
      {
        path: 'recipes',
        component: () => import('pages/recipePage.vue'),
        meta: {
          title: '精選食譜',
        },
      },
      {
        path: 'articles',
        component: () => import('pages/articlePage.vue'),
        meta: {
          title: '廚藝分享',
        },
      },
      {
        path: 'recipes/:id',
        component: () => import('pages/recipeInfo.vue'),
        meta: {
          title: '首頁',
        },
      },
      {
        path: 'register',
        component: () => import('pages/registerPage.vue'),
        meta: {
          title: '註冊',
          login: 'no-login-only',
        },
      },
      {
        path: 'login',
        component: () => import('pages/loginPage.vue'),
        meta: {
          title: '登入',
          login: 'no-login-only',
        },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/adminLayout.vue'),
    meta: {
      title: '管理員',
      login: 'login-only',
    },
    children: [
      {
        path: '',
        component: () => import('pages/admin/indexPage.vue'),
        meta: {
          title: '管理首頁',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'dashboardPage',
        component: () => import('pages/admin/dashboardPage.vue'),
        meta: {
          title: '營運管理',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'recipesPage',
        component: () => import('pages/admin/recipesPage.vue'),
        meta: {
          title: '食譜管理',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'missionsPage',
        component: () => import('pages/admin/missionsPage.vue'),
        meta: {
          title: '任務管理',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'accountsPage',
        component: () => import('pages/admin/accountsPage.vue'),
        meta: {
          title: '使用者管理',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'articlesPage',
        component: () => import('pages/admin/articlesPage.vue'),
        meta: {
          title: '文章管理',
          login: 'login-only',
          admin: true,
        },
      },
      {
        path: 'commentsPage',
        component: () => import('pages/admin/commentsPage.vue'),
        meta: {
          title: '留言管理',
          login: 'login-only',
          admin: true,
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
