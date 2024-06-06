import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {
    private data: any;
    private apiUrl = 'http://localhost:3000/studenti';
    private baseUrl = 'http://localhost:3000';

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

    getStudente(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getStudenti(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    updateStudente(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    getPercorso(idPercorso: string): Observable<any> {
        console.log('ID Percorso:', idPercorso); // Отладочный вывод
        return this.http.get<any>(`${this.baseUrl}/percorsi/${idPercorso}`);
    }

    checkDateInDatabase(studentId: string, date: string): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.apiUrl}/${studentId}/checkDate/${date}`
        );
    }
}
