<h1 align="center">IT-Bangmod Kradan Kanban (Frontend)</h1>

<div align="center">
  <img src="public/itbkk-logo.svg" width="150px" height="200px" />

This project is a kanban board for IT students, lecturers and staffs at King Mongkut's University of Technology Thonburi.
</div>

## This project is built with:

<a href="https://vuejs.org"><img height="30px" src="https://img.shields.io/badge/Vue%20js-1a1a1a?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" /></a>
<a href="https://tailwindcss.com"><img height="30px" src="https://img.shields.io/badge/Tailwind_CSS-0b1121?style=for-the-badge&logo=tailwind-css&logoColor=38bdf8" /></a>
<a href="https://daisyui.com"><img height="30px" src="https://img.shields.io/badge/daisyUI-1d232a?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyBjbGFzcz0iaC02IHctNiBtZDpoLTggbWQ6dy04IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0MTUgNDE1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjgyLjUiIHk9IjI5MCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIxMjUiIHJ4PSI2Mi41IiBmaWxsPSIjMUFEMUE1Ij48L3JlY3Q+PGNpcmNsZSBjeD0iMjA3LjUiIGN5PSIxMzUiIHI9IjEzMCIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iLjMiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIwNy41IiBjeT0iMTM1IiByPSIxMjUiIGZpbGw9IndoaXRlIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIyMDcuNSIgY3k9IjEzNSIgcj0iNTYiIGZpbGw9IiNGRjk5MDMiPjwvY2lyY2xlPjwvc3ZnPg==" /></a>
<a href="https://www.npmjs.com/package/zyos"><img height="30px" src="https://img.shields.io/badge/zyos-black?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMjc0MiIgaGVpZ2h0PSIyNDkzIiB2aWV3Qm94PSIwIDAgMjc0MiAyNDkzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTk3OS44NSAyOTEuNDg1TDI0MzEuMiA1NzUuNzYyTDEwMTcuNzMgMTY3My40OEwyNDgxLjgyIDE4NThMNzgyLjI0MiAyMjA0LjQ3TDI3OS44NDMgMTkwMy43OUwxNDQxLjI4IDcwNy45NzJMMjk2LjM5MSA0MzAuMDRMMTk3OS44NSAyOTEuNDg1WiIgZmlsbD0iIzAwRThBMiIvPgo8L3N2Zz4K" /></a>
<a href="https://vitejs.dev"><img height="30px" src="https://img.shields.io/badge/Vite-1b1b1f?style=for-the-badge&logo=vite&logoColor=FFD62E" /></a>

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
