import DefaultTheme from 'vitepress/theme'
import { onContentUpdated, useRoute } from 'vitepress'
import { watch, nextTick } from 'vue'
import './book.css'

/* ============================================================
   阅读增强
   1. 图片灯箱：点击插图放大
   2. 字号调节：小 / 中 / 大，写入 localStorage
   3. 代码块复制按钮
   4. 阅读进度条
   ============================================================ */

const FONT_KEY = 'ospp-font-scale'
const SCALES = [0.9, 1, 1.14]        // 小 / 中 / 大
const SCALE_NAMES = ['小', '中', '大']

function applyScale(idx: number) {
  const root = document.documentElement
  const scale = SCALES[idx] ?? 1
  root.style.setProperty('--book-scale', String(scale))
  root.dataset.fontScale = SCALE_NAMES[idx] ?? '中'
  try {
    localStorage.setItem(FONT_KEY, String(idx))
  } catch {}
}

function initFontControl() {
  if (document.querySelector('.font-ctl')) return
  const saved = Number(localStorage.getItem(FONT_KEY) ?? '1')
  const idx0 = Number.isFinite(saved) && saved >= 0 && saved < SCALES.length ? saved : 1
  applyScale(idx0)

  const box = document.createElement('div')
  box.className = 'font-ctl'
  box.innerHTML = `
    <button type="button" class="font-btn" data-i="0" title="小号字">A</button>
    <button type="button" class="font-btn" data-i="1" title="中号字">A</button>
    <button type="button" class="font-btn" data-i="2" title="大号字">A</button>
  `
  box.querySelectorAll<HTMLButtonElement>('.font-btn').forEach((btn) => {
    const i = Number(btn.dataset.i)
    btn.addEventListener('click', () => {
      applyScale(i)
      box.querySelectorAll('.font-btn').forEach((b) => b.classList.remove('on'))
      btn.classList.add('on')
    })
  })
  const active = box.querySelector<HTMLButtonElement>(`.font-btn[data-i="${idx0}"]`)
  active?.classList.add('on')
  document.body.appendChild(box)
}

function initLightbox() {
  let mask = document.querySelector<HTMLDivElement>('.img-mask')
  if (!mask) {
    mask = document.createElement('div')
    mask.className = 'img-mask'
    mask.innerHTML = '<img alt=""><div class="img-hint">点击任意处关闭</div>'
    mask.addEventListener('click', () => mask!.classList.remove('show'))
    document.body.appendChild(mask)
  }
  const maskImg = mask.querySelector('img')!

  document.querySelectorAll<HTMLImageElement>('.book-figure img').forEach((img) => {
    if (img.dataset.zoomReady) return
    img.dataset.zoomReady = '1'
    img.classList.add('zoomable')
    img.addEventListener('click', () => {
      maskImg.src = img.currentSrc || img.src
      maskImg.alt = img.alt || ''
      mask!.classList.add('show')
    })
  })

  if (!document.body.dataset.escBound) {
    document.body.dataset.escBound = '1'
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelector('.img-mask')?.classList.remove('show')
      }
    })
  }
}

function initCodeCopy() {
  document.querySelectorAll<HTMLElement>('.vp-doc div[class*="language-"]').forEach((block) => {
    if (block.dataset.copyReady) return
    block.dataset.copyReady = '1'
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.type = 'button'
    btn.textContent = '复制'
    btn.addEventListener('click', async () => {
      const code = block.querySelector('pre code')?.textContent ?? ''
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = '已复制'
      } catch {
        btn.textContent = '失败'
      }
      setTimeout(() => (btn.textContent = '复制'), 1600)
    })
    block.appendChild(btn)
  })
}

function initProgress() {
  let bar = document.querySelector<HTMLDivElement>('.read-progress')
  if (!bar) {
    bar = document.createElement('div')
    bar.className = 'read-progress'
    bar.innerHTML = '<i></i>'
    document.body.appendChild(bar)
  }
  const inner = bar.querySelector('i')!
  const update = () => {
    const h = document.documentElement
    const total = h.scrollHeight - h.clientHeight
    const p = total > 0 ? h.scrollTop / total : 0
    inner.style.width = `${Math.min(100, Math.max(0, p * 100))}%`
  }
  if (!(window as any).__osppScroll) {
    ;(window as any).__osppScroll = true
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
  }
  update()
}

function enhance() {
  initFontControl()
  initLightbox()
  initCodeCopy()
  initProgress()
}

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    if (typeof window !== 'undefined') {
      onContentUpdated(() => {
        nextTick(() => setTimeout(enhance, 60))
      })
      watch(
        () => route.path,
        () => nextTick(() => setTimeout(enhance, 120)),
      )
      setTimeout(enhance, 200)
    }
  },
}
