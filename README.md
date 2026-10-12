# React + Vite

## Avvio in locale

Dalla cartella del progetto:

```bash
npm install   # solo la prima volta, o se mancano dipendenze
npm run dev
```

Poi apri nel browser:

```
http://localhost:5173/education_platform/
```

Il suffisso `/education_platform/` è necessario perché in `vite.config.js` è impostato `base: '/education_platform/'` (serve per il deploy su GitHub Pages). Aprendo solo `http://localhost:5173` la pagina risulta vuota. L'URL esatto viene comunque mostrato nel terminale all'avvio; se la porta 5173 è occupata, Vite ne usa un'altra.

Per fermare il server: `Ctrl+C` nel terminale.

### Provare la build di produzione

```bash
npm run build
npm run preview
```

Poi apri `http://localhost:4173/education_platform/`.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
