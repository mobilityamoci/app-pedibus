import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {
    private data: any;
    private apiUrl = 'http://127.0.0.1:8000/api';
    constructor(private http: HttpClient) {}

    setData(data: any) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    clearData() {
        this.data = null;
    }

    authenticate(uuid: string, type: string) {
        return this.http.post<any>(`${this.apiUrl}/authenticate`, {
            uuid: uuid,
            type: type,
        });
    }

    getStudente(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const url = `${this.apiUrl}/parent`;

        return this.http.get<any>(url, { headers });
    }

    getStudenti(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    updateStudente(data: { days: string[] }): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const url = `${this.apiUrl}/absence-days`;

        return this.http.post<any>(url, data, { headers });
    }

    getPercorso(idPercorso: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            type: ['parent'],
            Authorization: `Bearer ${token}`,
        });
        const url = `${this.apiUrl}/get-percorso/${idPercorso}`;
        console.log(url);

        return this.http.get<any>(url, { headers });
    }

    getFullPath(idPercorso: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        const url = `${this.apiUrl}/get-percorso/${idPercorso}`;
        console.log(url);

        return this.http.get<any>(url, { headers });
    }

    // checkDateInDatabase(date: string): Observable<boolean> {
    //     const token = localStorage.getItem('token');
    //     const headers = new HttpHeaders({
    //         Authorization: `Bearer ${token}`,
    //     });

    //     const url = `${this.apiUrl}/parent/${date}`;

    //     return this.http.get<boolean>(
    //         url, {headers}
    //     );
    // }

    getFermata(id: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        const url = `${this.apiUrl}/get-fermate/${id}`
        return this.http.get<any>(url, {headers});
    }
}
