import options from '@/utils/options'

const breakpoint = 640
const { offsetWidth } = document.body

const isMobile = offsetWidth <= breakpoint

if (isMobile) {
  if (options.fontSize) {
    const offset = Math.ceil((breakpoint - offsetWidth) / 60)
    options.fontSize -= offset
  }

  const root = document.getElementById('root')
  window.addEventListener('resize', () => {
    if (root) {
      root.style.height = window.innerHeight + 'px'
    }
  })
}

export { isMobile }
