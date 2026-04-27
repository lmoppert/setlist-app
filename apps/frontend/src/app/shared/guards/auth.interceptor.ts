import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const password = localStorage.getItem('band_password') || '';
  const authReq = req.clone({
    headers: req.headers.set('X-Band-Password', password),
  });
  return next(authReq);
};