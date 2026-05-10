# Convenciones — mastro-llm

Este documento recoge las convenciones que se desprenden de la configuración actual del repositorio (`.editorconfig`, `tsconfig.*.json`, `angular.json`, schematics) y de cómo está escrito el código que ya existe. El proyecto está recién scaffoldeado, así que algunas convenciones todavía son aspiracionales y se anotan como tales.

## Lenguaje y formato de código

El archivo `.editorconfig` fija las reglas de bajo nivel: codificación UTF-8, indentación con 2 espacios, salto de línea final obligatorio en cada archivo, y `trim_trailing_whitespace` activado. Para archivos `.ts` se exige comilla simple (`quote_type = single`). En `.md` se desactiva el límite de línea y no se recortan espacios al final, lo que deja libertad al escribir documentación.

TypeScript se compila en modo estricto integral: `strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`. Esto implica varios hábitos obligatorios:

- Todo método que sobreescriba uno de la clase base lleva `override`.
- El acceso a propiedades dinámicas exige notación `obj['key']` cuando la clave no está declarada en el tipo.
- Toda función con tipo de retorno declarado debe retornar en todos los caminos.
- En `switch`, cada `case` debe terminar (`break`/`return`/`throw`) salvo intención explícita documentada.

Del lado de Angular, el `tsconfig.json` activa `strictTemplates`, `strictInjectionParameters` y `strictInputAccessModifiers`. Los templates HTML se chequean con tipos, los parámetros inyectados deben ser tipos resolubles por el inyector, y los `@Input()` con modificadores de acceso restringidos no se exponen accidentalmente.

El target del compilador es ES2022 con módulos ES2022, e `importHelpers: true`, así que se debe mantener `tslib` como dependencia y evitar polyfills manuales para features ya cubiertas por el target.

## Componentes, directivas y pipes

Todos los artefactos generados con Angular CLI usan **standalone components** por defecto. `angular.json` lo declara explícitamente:

```json
"@schematics/angular:component": { "style": "scss", "standalone": true },
"@schematics/angular:directive": { "standalone": true },
"@schematics/angular:pipe":      { "standalone": true }
```

En la práctica esto significa que un componente nuevo se genera con `standalone: true`, declara sus propios `imports: [...]` (typicamente `CommonModule` y los módulos/componentes que use), y se compone vía esos imports en lugar de declararse en un `NgModule`. No existe `AppModule` ni se planea uno: el bootstrap se hace con `bootstrapApplication` y los providers globales viven en `app.config.ts`.

El **prefijo de selector** es `app-` (configurado en `angular.json` como `"prefix": "app"`). El componente raíz usa `selector: 'app-root'` y los componentes futuros deberían seguir `app-<nombre>`.

Convenciones de archivos por componente, ya visibles en `AppComponent`:

- `<nombre>.component.ts` — clase con decorador `@Component`.
- `<nombre>.component.html` — template referenciado por `templateUrl`.
- `<nombre>.component.scss` — estilos referenciados por `styleUrls` (array, no string).
- `<nombre>.component.spec.ts` — tests Jasmine usando `TestBed.configureTestingModule({ imports: [Componente] })` (no `declarations`, porque son standalone).

El estilo del componente puede estar vacío y, aun así, mantenerse el archivo `.scss` referenciado: ése es el patrón que sigue `app.component.scss` hoy.

## Estilos

SCSS es el lenguaje de estilos por defecto, tanto para archivos externos como para estilos inline (`inlineStyleLanguage: "scss"` en el builder). Los estilos globales viven en `src/styles.scss`. Los presupuestos de producción topan los estilos por componente en 2 KB de warning y 4 KB de error, así que conviene mantener los SCSS por componente acotados y empujar lo compartido a partials globales o a un sistema de tokens cuando se introduzca uno.

Hoy el `AppComponent` aún tiene un bloque `<style>` embebido dentro del HTML como herencia del template del CLI. Eso es un placeholder, no una convención: cuando se reemplace el template, los estilos del componente deben vivir en `app.component.scss`, no inline en HTML.

## Routing

Las rutas se definen en `src/app/app.routes.ts` como `export const routes: Routes = []` y se proveen una sola vez en `app.config.ts` mediante `provideRouter(routes)`. Cuando se añadan rutas, el patrón esperado es lazy loading por feature con `loadComponent` apuntando al componente standalone:

```ts
{ path: 'notebooks', loadComponent: () => import('./features/notebooks/notebooks-page.component').then(m => m.NotebooksPageComponent) }
```

No hay `RouterModule.forRoot` ni `RouterModule.forChild`: ese patrón pertenece a la era de `NgModule` y no se usa en este proyecto.

## Providers globales

Cualquier provider que deba existir como singleton para toda la app (HttpClient, animaciones, interceptores, configuración de proveedores LLM, store) se registra dentro del array `providers` de `appConfig` en `src/app/app.config.ts`. Para HTTP se debería usar `provideHttpClient(withInterceptors([...]))`, no `HttpClientModule`. Para animaciones, `provideAnimations()` o `provideNoopAnimations()` en tests.

## Nomenclatura

Las convenciones implícitas, derivadas del scaffold y de las defaults del Angular Style Guide, son:

- Archivos en `kebab-case` con sufijo de tipo (`.component.ts`, `.service.ts`, `.directive.ts`, `.pipe.ts`, `.guard.ts`, `.spec.ts`).
- Clases en `PascalCase` con sufijo de tipo (`AppComponent`, `LlmService`, `AuthGuard`).
- El nombre del proyecto Angular CLI es `mastro-llm` (kebab-case); los selectores siguen ese mismo estilo precedidos de `app-`.

## Tests

Los specs usan Jasmine sobre Karma. La configuración del builder de tests incluye `zone.js/testing` como polyfill, así que el patrón estándar de `TestBed` con `fakeAsync`, `tick`, etc., funciona out of the box. Para componentes standalone, `configureTestingModule` recibe el componente directamente en `imports` (ver `app.component.spec.ts`).

## Gestor de paquetes

**pnpm** es el gestor de paquetes oficial del proyecto. Los scripts en `package.json` se invocan con `pnpm <script>` (por ejemplo `pnpm start`, `pnpm test`, `pnpm build`). Para añadir dependencias se usa `pnpm add <paquete>` (y `pnpm add -D <paquete>` para devDependencies). El lockfile canónico es `pnpm-lock.yaml` y debe commitearse.

No mezclar con npm ni yarn: ejecutar `npm install` o `yarn install` en el repo generará un lockfile paralelo que entra en conflicto con `pnpm-lock.yaml` y termina pisando versiones. Si se encuentra un `yarn.lock` o `package-lock.json` en el repo, hay que eliminarlo y regenerar con `pnpm install`.

Para reforzar este contrato conviene declarar `packageManager` en `package.json` (por ejemplo `"packageManager": "pnpm@9.0.0"`) y, opcionalmente, agregar un `preinstall` con [`only-allow`](https://github.com/pnpm/only-allow) (`"preinstall": "npx only-allow pnpm"`) para que cualquier intento de instalar con otro gestor falle de inmediato.

## Lo que aún no está definido

Algunas convenciones quedan pendientes y conviene fijarlas antes de que el código crezca:

- **Linter / formateador**: no hay `.eslintrc`, `.prettierrc`, ni `tslint.json`. La consistencia hoy depende solo de `.editorconfig` y del compilador estricto.
- **Estructura de carpetas**: no hay `core/`, `shared/`, `features/`, `models/`. Definir esta partición temprano evita refactors caros más adelante.
- **Convenciones para servicios HTTP y manejo de errores**: aún sin patrón establecido.
- **Estrategia de cambio de detección**: se asume default; si se adopta `OnPush` por componente, conviene documentarlo.
- **Manejo de configuración por entorno**: no existen archivos `environments/`. Cuando se introduzcan, hay que registrar el `fileReplacements` en la configuración `production` de `angular.json`.
