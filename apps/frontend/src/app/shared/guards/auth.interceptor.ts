import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const password = localStorage.getItem('band_password') || '';

  const authReq = req.clone({
    headers: req.headers.set('x-band-password', password),
  });

  return next(authReq).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          if (password) {
            console.warn('Authentifizierung fehlgeschlagen. Passwort wird gelöscht.');
            localStorage.removeItem('band_password');
            location.reload();
          }
        }
      }
    })
  );
};