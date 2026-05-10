import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_ENV } from '@/domain/tokens/app-env.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const { authToken } = inject(APP_ENV);
  if (!authToken) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } }));
};