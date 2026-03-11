import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CharacterView from '@/views/CharacterView.vue'
import BossView from '@/views/BossView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ShopView from '@/views/ShopView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '任务面板' }
  },
  {
    path: '/character',
    name: 'character',
    component: CharacterView,
    meta: { title: '角色信息' }
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView,
    meta: { title: '商店' }
  },
  {
    path: '/boss',
    name: 'boss',
    component: BossView,
    meta: { title: 'Boss战' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: '设置' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - RPG Todo`
  }
  next()
})

export default router
