import Vue from 'vue'
import VueI18n from 'vue-i18n'
// iview UI
import ivenUS from 'iview/dist/locale/en-US'
import ivzhCN from 'iview/dist/locale/zh-CN'
import ivzhTW from 'iview/dist/locale/zh-TW'
import ivjaJP from 'iview/dist/locale/ja-JP' // ✅ 일본어 추가
// element UI
import elenUS from 'element-ui/lib/locale/lang/en'
import elzhCN from 'element-ui/lib/locale/lang/zh-CN'
import elzhTW from 'element-ui/lib/locale/lang/zh-TW'
import eljaJP from 'element-ui/lib/locale/lang/ja' // ✅ 일본어 추가

Vue.use(VueI18n)

const languages = [
  { value: 'en-US', label: 'English', iv: ivenUS, el: elenUS },
  { value: 'zh-CN', label: '简体中文', iv: ivzhCN, el: elzhCN },
  { value: 'zh-TW', label: '繁體中文', iv: ivzhTW, el: elzhTW },
  { value: 'ja-JP', label: '日本語', iv: ivjaJP, el: eljaJP } // ✅ 일본어 추가
]

const messages = {}

// combine admin and oj
for (let lang of languages) {
  let locale = lang.value
  let m = require(`./oj/${locale}`).m
  Object.assign(m, require(`./admin/${locale}`).m)
  let ui = Object.assign(lang.iv, lang.el)
  messages[locale] = Object.assign({ m: m }, ui)
}

// load language packages
export default new VueI18n({
  locale: 'ja-JP', // ✅ 기본 언어를 일본어로 설정할 수도 있음
  messages: messages
})

export { languages }
