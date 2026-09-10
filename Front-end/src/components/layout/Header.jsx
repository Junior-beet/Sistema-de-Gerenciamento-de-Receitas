import { APP_NAME } from '../../config/constants.jsx'
import { auth } from '../../services/auth.jsx'

function getRotas() {
  if (auth.estaLogado()) {
    return [
      { href: '/calculos', label: 'Calculos' },
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
  nav.style.color = 'white'

  const container = document.createElement('div')
  container.className = 'container'

  const brand = document.createElement('a')
  brand.className = 'navbar-brand'
  brand.href = '/'
  brand.style.cursor = 'pointer'
  brand.style.color = 'white'

  const logo = document.createElement('img')
  logo.src = '/assets/letraLOGO.png'
  logo.alt = 'Logo do SGR'
  logo.style.cssText = 'width:72px;height:32px'

  brand.appendChild(logo)
  
  brand.addEventListener('click', e => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('navegar', { detail: '/' }))
  })

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
    a.style.color = 'white'
    a.style.setProperty('color', 'white', 'important')

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
