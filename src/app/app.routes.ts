import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/notebook/notebook-page.component').then(
        (m) => m.NotebookPageComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
