import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    public setToken(token: string) {
        localStorage.setItem('token', token);
    }

    public getToken(): string | null {
        return localStorage.getItem('token');
    }

    public removeToken() {
        localStorage.removeItem('token');
    }

    public getId(){
        return localStorage.getItem('idFermate')
    }

    public setId(id: string){
        localStorage.setItem('idFermate', id)
    }
}
