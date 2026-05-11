import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function sessionInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const sessionReq = req.clone({
    withCredentials: true,
  });

  return next(sessionReq).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Authentifizierung abgelaufen.');
          //location.reload();
        }
      },
    }),
  );
}
