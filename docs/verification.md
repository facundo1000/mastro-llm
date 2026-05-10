# Verificación — mastro-llm

Este documento describe cómo se verifica hoy que el proyecto compila, corre y pasa sus tests, y qué señales adicionales se pueden chequear con la configuración actual. Cubre lo que **existe hoy** (Karma + Jasmine, tsc estricto, presupuestos de bundle) y deja anotadas las verificaciones que aún no están automatizadas.

## Verificaciones disponibles

### Compilación TypeScript y de templates

`pnpm build` ejecuta `ng build` con la configuración `production` por defecto. Esto dispara el compilador de TypeScript con todas las flags estrictas activadas en `tsconfig.json` y, además, el compilador AOT de Angular con `strictTemplates` activo —lo que significa que los errores de tipo en HTML rompen la build, no sólo los de TypeScript. Una build limpia es la primera señal de que el código está bien tipado.

Para iteración rápida sin pasar por producción, `pnpm watch` (`ng build --watch --configuration development`) recompila en cada cambio sin optimización ni hashing. Es útil para detectar regresiones de tipos sin esperar el bundling completo.

### Servidor de desarrollo

`pnpm start` levanta `ng serve` en `http://localhost:4200/` con HMR y recarga automática. Es la verificación interactiva: si la app no arranca o lanza errores en consola del navegador, hay un problema runtime que ni el compilador ni los tests están viendo.

### Tests unitarios

`pnpm test` ejecuta `ng test`, que usa el builder `@angular-devkit/build-angular:karma` con Jasmine. La config heredada de Angular CLI 16 levanta Chrome (vía `karma-chrome-launcher`), reportea con `karma-jasmine-html-reporter` y deja disponible `karma-coverage` si se invoca con `--code-coverage`.

El polyfill `zone.js/testing` está cargado, así que se pueden usar `fakeAsync` y `tick` sin configuración extra. Los specs siguen el patrón `*.spec.ts` y se descubren automáticamente por `tsconfig.spec.json` (`include: ["src/**/*.spec.ts", "src/**/*.d.ts"]`).

Hoy existe un único spec, `src/app/app.component.spec.ts`, que verifica tres cosas: que el componente raíz se crea, que `title === 'mastro-llm'`, y que el template renderiza el título dentro de `.content span`. Ese tercer test depende del template placeholder generado por Angular CLI; cuando se reemplace el HTML del componente raíz por la UI real, el spec va a romperse y deberá actualizarse en el mismo cambio.

Para ejecuciones single-shot en CI conviene invocar `ng test --watch=false --browsers=ChromeHeadless`, lo que evita que Karma quede colgado esperando cambios.

### Cobertura de código

Karma-coverage está instalado pero no configurado con thresholds. `ng test --code-coverage` genera un reporte en `./coverage/`. Hoy no hay un mínimo exigido y la cobertura no se publica en ningún lado.

### Presupuestos de bundle

La configuración `production` en `angular.json` define presupuestos que actúan como verificación pasiva en cada build:

- Bundle inicial: warning a 500 KB, error a 1 MB.
- Estilos por componente: warning a 2 KB, error a 4 KB.

Si una build de producción supera estos umbrales, falla. Esto es relevante porque el clon va a integrar varios SDKs de proveedores LLM y, si se cargan todos en el bundle inicial sin lazy loading, este presupuesto va a saltar antes que cualquier otro test.

## Verificaciones que **no** están configuradas hoy

Las siguientes piezas son habituales en un proyecto Angular maduro y todavía no existen en el repositorio. Conviene tenerlas en cuenta y agregarlas a medida que el proyecto crezca:

- **Linter**: no hay ESLint (`@angular-eslint`), TSLint ni equivalente. No hay verificación estática de estilo más allá del compilador.
- **Formateador**: no hay Prettier. La consistencia depende de `.editorconfig` y de la disciplina del editor.
- **Tests e2e**: no hay Cypress, Playwright ni Protractor. El target `e2e` no está declarado en `angular.json`.
- **CI**: no hay workflow de GitHub Actions, GitLab CI ni equivalente en el repo. Las verificaciones se corren a mano.
- **Hooks de pre-commit**: no hay Husky ni `lint-staged`. Nada bloquea un commit que rompa la build.
- **Auditoría de dependencias**: no hay script automatizado, aunque `pnpm audit` está disponible localmente.
- **Análisis de bundle**: `webpack-bundle-analyzer` no está integrado. Se puede ejecutar manualmente sobre la salida de `ng build --stats-json` cuando haga falta.

## Checklist manual recomendado antes de mergear cambios

Mientras no haya CI automatizado, antes de mergear conviene correr a mano:

```bash
pnpm install
pnpm build                                       # build de producción (incluye type-check estricto)
pnpm test --watch=false --browsers=ChromeHeadless # tests unitarios single-shot
```

Y, si el cambio afecta UI o flujos visibles:

```bash
pnpm start
# verificar manualmente las pantallas tocadas en http://localhost:4200/
```

Cuando se agreguen rutas, servicios HTTP o adaptadores de proveedores LLM, este checklist debería extenderse con tests específicos por feature y, eventualmente, con una suite e2e que cubra al menos el happy path de cada proveedor soportado.

## Errores comunes y dónde los va a atrapar cada verificación

`tsc` y el compilador AOT (vía `pnpm build` o `pnpm watch`) atrapan: tipos incorrectos en TS, propiedades inexistentes en templates, `@Input()` mal tipados, retornos faltantes, casts inseguros desde `unknown`, accesos a propiedades de index signatures sin notación de bracket.

Karma + Jasmine (vía `pnpm test`) atrapan: regresiones funcionales en componentes, servicios y pipes que tengan specs; problemas de inyección de dependencias en `TestBed` cuando un provider o un import se rompe; cambios en el template que invaliden assertions de DOM.

Los presupuestos de bundle atrapan: imports accidentales de librerías pesadas en el bundle inicial, regresiones de tamaño tras agregar dependencias, estilos por componente que crecen sin control.

Lo que **ningún** mecanismo automatizado actual atrapa: regresiones visuales, problemas de accesibilidad, errores runtime en rutas que aún no tienen specs, integraciones reales con APIs de proveedores LLM. Esos huecos se cubren hoy sólo con verificación manual en el navegador.
