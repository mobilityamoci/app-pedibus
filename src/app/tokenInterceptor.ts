import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        let headers = req.headers.set('type', ['parent', 'guardian']);

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        const cloned = req.clone({ headers });
        return next.handle(cloned);
    }
}
