export interface Studente {
    id: string;
    scuola: string;
    classe: string;
    fermata: string;
    orario: string;
    percorso_id: string;
    fermata_coord: [number, number];
    absenceDays: string[];
}
