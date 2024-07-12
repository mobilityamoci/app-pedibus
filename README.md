# MobilityAmoci
## _La piattaforma per i mobility manager scolastici e aziendali_

### Descrizione estesa

Mobilitiamoci è una piattaforma web che aiuta nella loro operatività i **Mobility Manager aziendali e scolastici di ogni ordine e grado**.
La finalità è quella di calcolare i percorsi casa-scuola o casa-lavoro di studenti o dipendenti aiutando con mappe,
dati e grafici a valutarne l'impatto logistico e ambientale.

Le principali funzionalità includono:
- Scansione di codici QR
- Visualizzazione di mappe interattive con OpenStreetMap
- Integrazione con Angular e Ionic per una UX/UI fluida

Attualmente il progetto è in una versione stabile e testata.

### Spiegazione struttura

Il repository si sviluppa su una branch: master, è utilizzata per tenere la versione stabile ed utilizzabile

Per eventuali lavori futuri ci sarà una branch dev che sarà usata per mandare avanti i lavori con versioni beta non testate e quindi meno stabili.

### Dipendenze
Questo progetto è un'applicazione web sviluppata utilizzando **Angular** 17.3.6 e **Ionic Framework** 7.2.0, che integra funzionalità di mappatura tramite **Leaflet** e **OpenStreetMap**. L'applicazione consente agli utenti di scansionare codici QR utilizzando **zxing** (ZebraCrossing).

Le dipendenze sono esplicitate nel file package.json.


### Istruzioni per l'installazione
1 Installare [Node.js](https://nodejs.org/en/download/package-manager)
- Installare [Angular](https://angular.dev) 
- Installare [Ionic](https://ionicframework.com/docs/intro/cli)
- Clonare il repository

- Eseguire i seguenti comandi
Per verificare se Angular è installato
```console
ng v
```

Per verificare che Ionic CLI è installato
```console
ionic v
```

All'interno della directory del progetto, esegui il seguente comando per installare tutte le dipendenze:
```console
npm i
```



### Conclusione

Il Copyright è detenuto dal Comune di Piacenza.
La manutenzione è affidata a Brainfarm Soc. Coop.

Per ogni segnalazione relativa alla sicurezza scrivere a it@brainfarm.eu.
