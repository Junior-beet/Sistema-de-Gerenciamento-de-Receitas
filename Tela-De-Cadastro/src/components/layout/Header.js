import { APP_NAME } from '../../config/constants.js'
import { auth } from '../../services/auth.js'

function getRotas() {
  if (auth.estaLogado()) {
    return [
      { href: '/saiba-mais', label: 'Saiba Mais' },
      { href: '#sair', label: 'Sair' },
    ]
  }
  return [
    { href: '/login', label: 'Login' },
    { href: '/cadastro', label: 'Cadastro' },
    { href: '/saiba-mais', label: 'Saiba Mais' },
  ]
}

export function Header(rotaAtiva) {
  const rotas = getRotas()
  const header = document.createElement('header')
  header.className = 'app-header sticky-top'

  const nav = document.createElement('nav')
  nav.className = 'navbar navbar-expand-sm'

  const container = document.createElement('div')
  container.className = 'container'

  const brand = document.createElement('a')
  brand.className = 'navbar-brand'
  brand.href = '/login'
  brand.style.cursor = 'pointer'

  const logo = document.createElement('span')
  logo.className = 'brand-logo'
  logo.textContent = 'S'

  const brandText = document.createElement('span')
  brandText.className = 'brand-text'
  brandText.textContent = APP_NAME

  brand.appendChild(logo)
  brand.appendChild(brandText)
  container.appendChild(brand)

  const toggle = document.createElement('button')
  toggle.className = 'navbar-toggler'
  toggle.type = 'button'
  toggle.dataset.bsToggle = 'collapse'
  toggle.dataset.bsTarget = '#navbarNav'
  toggle.setAttribute('aria-label', 'Menu de navegação')
  toggle.innerHTML = '<span class="navbar-toggler-icon"></span>'
  container.appendChild(toggle)

  const collapse = document.createElement('div')
  collapse.className = 'collapse navbar-collapse'
  collapse.id = 'navbarNav'

  const ul = document.createElement('ul')
  ul.className = 'navbar-nav ms-auto gap-1'

  rotas.forEach(rota => {
    const li = document.createElement('li')
    li.className = 'nav-item'

    const a = document.createElement('a')
    a.className = `nav-link ${rota.href === rotaAtiva ? 'active' : ''}`
    a.href = rota.href
    a.textContent = rota.label

    a.addEventListener('click', e => {
      e.preventDefault()
      if (rota.href === '#sair') {
        auth.logout()
        window.dispatchEvent(new CustomEvent('navegar', { detail: '/login' }))
        return
      }
      window.dispatchEvent(new CustomEvent('navegar', { detail: rota.href }))
    })

    li.appendChild(a)
    ul.appendChild(li)
  })

  collapse.appendChild(ul)
  container.appendChild(collapse)
  nav.appendChild(container)
  header.appendChild(nav)

  return header
}
