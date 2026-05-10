# Arquitectura — mastro-llm

Este documento describe el estado actual del proyecto `mastro-llm`, un clon de NotebookLM cuya diferencia clave con el producto original será permitir al usuario alternar entre múltiples proveedores de LLM (Claude, OpenAI, Grok, Qwen, DeepSeek, etc.). El frontend está construido con Angular 16 usando la API de componentes standalone.

> Nota: el proyecto se encuentra en estado de scaffold. Lo que sigue describe lo que **hay hoy** en el repositorio, no la arquitectura objetivo. Donde corresponda, se señala qué piezas todavía no existen y dónde encajarán cuando se implementen.

## Stack y versiones

El núcleo es Angular 16.2 sobre TypeScript 5.1, RxJS 7.8 y Zone.js 0.13. La build, el servidor de desarrollo, los tests y la extracción de i18n se manejan a través de `@angular-devkit/build-angular` (browser builder + dev-server + karma builder). El gestor de paquetes oficial del proyecto es **pnpm**. El repositorio conserva un `yarn.lock` heredado del scaffolding; debe eliminarse y reemplazarse por `pnpm-lock.yaml` (`rm yarn.lock && pnpm install`) para evitar lockfiles conflictivos. Los tests usan Karma 6.4 con Jasmine 4.6 y los reporters estándar de Angular CLI (`karma-jasmine-html-reporter`, `karma-coverage`). El estilo se escribe en SCSS, y el TypeScript está configurado en modo estricto (`strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`) con `strictTemplates`, `strictInjectionParameters` y `strictInputAccessModifiers` habilitados desde el lado de Angular.

El target de compilación es ES2022 con módulos ES2022, e `importHelpers` activado apoyándose en `tslib`. La salida de build se emite en `dist/mastro-llm` y los presupuestos de producción están en 500 KB de warning / 1 MB de error para el bundle inicial, con 2 KB / 4 KB por estilo de componente. La configuración de desarrollo desactiva la optimización, mantiene `vendorChunk` y `namedChunks`, y emite source maps.

## Estructura del repositorio

```
mastro-llm/
├── angular.json              # Configuración del workspace Angular CLI
├── package.json              # Scripts y dependencias (pnpm)
├── pnpm-lock.yaml            # Lockfile de pnpm (a generar con `pnpm install`)
├── tsconfig.json             # Compilador base (strict + Angular strict templates)
├── tsconfig.app.json         # Override para la app (entry: src/main.ts)
├── tsconfig.spec.json        # Override para tests (incluye .spec.ts, types: jasmine)
├── .editorconfig             # 2 espacios, comillas simples en TS, charset utf-8
├── .gitignore                # Estándar de Angular CLI
├── README.md                 # README por defecto del CLI
└── src/
    ├── main.ts               # Bootstrap standalone con bootstrapApplication
    ├── index.html            # <app-root> + viewport + favicon
    ├── styles.scss           # Estilos globales (vacío hoy)
    ├── favicon.ico
    ├── assets/               # Activos estáticos (sólo .gitkeep por ahora)
    └── app/
        ├── app.component.ts          # Standalone, selector "app-root"
        ├── app.component.html        # Placeholder de Angular CLI con <router-outlet>
        ├── app.component.scss        # Vacío
        ├── app.component.spec.ts     # Tests del componente raíz
        ├── app.config.ts             # ApplicationConfig: provideRouter(routes)
        └── app.routes.ts             # export const routes: Routes = [];
```

No existen todavía carpetas para features, dominio, servicios compartidos, modelos, ni `environments/`. Todo el código de aplicación vive directamente bajo `src/app/`.

## Bootstrap y composición de la aplicación

El arranque sigue el patrón standalone moderno de Angular 16: `src/main.ts` invoca `bootstrapApplication(AppComponent, appConfig)`. `appConfig` (en `src/app/app.config.ts`) es un `ApplicationConfig` que hoy declara un único provider, `provideRouter(routes)`. No se usa `AppModule` y no hay un módulo raíz; cualquier provider nuevo (HTTP, animations, interceptores, providers de dominio) deberá agregarse aquí dentro de `providers: []`.

`AppComponent` está declarado como `standalone: true`, importa `CommonModule` y `RouterOutlet`, y por ahora renderiza el template de bienvenida que genera Angular CLI (cabe destacar que ese template incluye `<router-outlet>` al final, así que las rutas que se agreguen sí se renderizarán bajo el placeholder).

El array `routes` está vacío. Cuando se introduzcan páginas (notebooks, fuentes, chat con el modelo, settings de proveedor LLM, etc.) deberán registrarse aquí, idealmente con lazy loading vía `loadComponent` para mantener el bundle inicial bajo el presupuesto de 500 KB.

## Flujo de datos y dominio

Todavía **no hay capa de datos**. No existen servicios, no hay modelos TypeScript de dominio (notebook, fuente, conversación, mensaje, proveedor de LLM), no hay clientes HTTP, no hay store ni signals compartidos, no hay interceptores para autenticación o manejo de errores. Tampoco existen archivos de entornos (`environments/environment.ts`, `environments/environment.prod.ts`) ni configuración para keys o endpoints de proveedores.

El plan implícito —dado que el proyecto se describe como un clon de NotebookLM con soporte multi-proveedor— sugiere que en algún momento se introducirá una abstracción tipo `LlmProvider` con implementaciones por proveedor (Claude, OpenAI, Grok, Qwen, DeepSeek), seguramente como servicios inyectables seleccionados mediante un token o un factory. Hoy esa pieza no existe en el código.

## Estilos

Los estilos globales viven en `src/styles.scss`, que actualmente está vacío salvo por un comentario. El builder está configurado con `inlineStyleLanguage: "scss"`, lo que significa que cualquier estilo inline en componentes (`styles: [...]`) también se procesará como SCSS. Los componentes usan `styleUrls` apuntando a un archivo `.scss` hermano. Hoy `app.component.scss` está vacío y todo el CSS del placeholder vive embebido en una etiqueta `<style>` dentro del HTML del componente raíz —ese bloque debería retirarse al reemplazar el template por la UI real.

No hay sistema de diseño definido aún (ni Angular Material, ni Tailwind, ni tokens propios). Esa decisión sigue abierta.

## Testing

La configuración de tests usa Karma + Jasmine vía `@angular-devkit/build-angular:karma`. Los specs siguen la convención `*.spec.ts` y se incluyen vía `tsconfig.spec.json`. Hoy existe un único spec, `app.component.spec.ts`, que cubre creación del componente, el valor de `title` y el render del título dentro de `.content span`. No hay configuración explícita de `karma.conf.js` ni `test.ts` en el repositorio: el builder usa los defaults de Angular CLI 16. No hay tests e2e configurados (no hay Cypress, Playwright ni Protractor).

## Build y ejecución

Los scripts disponibles son `pnpm start` (`ng serve`, dev server en `http://localhost:4200/`), `pnpm build` (`ng build`, configuración por defecto = `production`), `pnpm watch` (`ng build --watch --configuration development`) y `pnpm test` (`ng test`). El proyecto Angular se llama `mastro-llm` y los targets disponibles en `angular.json` son `build`, `serve`, `extract-i18n` y `test`.

## Áreas que aún faltan definir

A futuro, las siguientes piezas tendrán que aparecer y conviene anticipar dónde:

- **Estructura de features**: hoy todo cuelga de `src/app/`. Una carpeta `src/app/features/` por feature (notebooks, chat, sources, settings) y `src/app/core/` para servicios singleton es un punto de partida razonable.
- **Capa de proveedores LLM**: probablemente bajo `src/app/core/llm/` con una interfaz común y adaptadores por proveedor.
- **Modelos de dominio**: en `src/app/core/models/` o coubicados con su feature.
- **HTTP y configuración**: `provideHttpClient()` en `app.config.ts`, archivos de `environments/` para endpoints y, si aplica, manejo de API keys del lado del cliente o vía un backend proxy.
- **Routing real**: poblar `app.routes.ts` con rutas lazy-loaded.
- **Sistema de estilos**: definir si se adopta una librería de componentes o se construye uno propio.
