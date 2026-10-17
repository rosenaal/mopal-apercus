import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { resolveRoute } from './lib/routes'

/*
  Les pages sont prérendues au build : le HTML servi contient déjà tout le
  contenu. React reprend ensuite la main sur ce même contenu pour les
  animations et le menu mobile. On repart d'un rendu neuf plutôt que d'une
  hydratation, car le HTML statique est volontairement dépourvu des états
  d'animation : hydrater produirait des divergences.
*/
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App route={resolveRoute(window.location.pathname)} />
  </StrictMode>,
)
