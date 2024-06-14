import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataTransferService {
    private data: any;
    private baseUrl = 'http://localhost:3000/studenti';
    private apiUrl = 'http://127.0.0.1:8000/api';
    private token!: string;
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

    authenticate(uuid: string, type: string){
        return this.http.post<any>(`${this.apiUrl}/authenticate`, {
            uuid: uuid,
            type: type
        });
    }

    getStudente(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            type: ['parent'],
            Authorization: `Bearer ${token}`,
        });

        const url = `${this.apiUrl}/parent`; 
        console.log('Request URL:', url); 
        console.log(
            'Headers:',
            headers
                .keys()
                .map((key) => `${key}: ${headers.get(key)}`)
                .join(', ')
        ); 

        return this.http.get<any>(url, { headers });
    }

    getStudenti(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    updateStudente(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    getPercorso(idPercorso: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/percorsi/${idPercorso}`);
    }

    checkDateInDatabase(studentId: string, date: string): Observable<boolean> {
        return this.http.get<boolean>(
            `${this.apiUrl}/${studentId}/checkDate/${date}`
        );
    }

    getFermata(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/accompagnatore/${id}`);
    }
}
