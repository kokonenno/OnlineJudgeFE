import types from '../types'
import api from '@oj/api'
import storage from '@/utils/storage'
import i18n from '@/i18n'
import router from '@/pages/admin/router' // ✅ 라우터 가져오기
import { STORAGE_KEY, USER_TYPE, PROBLEM_PERMISSION } from '@/utils/constants'

const state = {
  profile: {}
}

const getters = {
  user: (state) => state.profile.user || {},
  profile: (state) => state.profile,
  isAuthenticated: (state) => !!state.profile.user, // ✅ 로그인 여부 확인
  isAdminRole: (state) => {
    const user = state.profile.user
    return user && (user.admin_type === USER_TYPE.ADMIN || user.admin_type === USER_TYPE.SUPER_ADMIN)
  },
  isSuperAdmin: (state) => {
    const user = state.profile.user
    return user && user.admin_type === USER_TYPE.SUPER_ADMIN
  },
  hasProblemPermission: (state) => {
    const user = state.profile.user
    return user && user.problem_permission !== PROBLEM_PERMISSION.NONE
  }
}

const mutations = {
  [types.CHANGE_PROFILE] (state, { profile }) {
    state.profile = profile
    if (profile.language) {
      i18n.locale = profile.language
    }
    storage.set(STORAGE_KEY.AUTHED, !!profile.user)
  }
}

const actions = {
  getProfile ({ commit }) { // ✅ 공백 추가
    return api.getUserInfo().then((res) => {
      commit(types.CHANGE_PROFILE, {
        profile: res.data.data || {}
      })
    })
  },
  clearProfile ({ commit }) { // ✅ 공백 추가
    commit(types.CHANGE_PROFILE, { profile: {} })
    storage.clear()
    router.push('/login') // ✅ 로그아웃 시 로그인 화면으로 이동
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
