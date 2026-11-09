# Menu interattivo Capri Blu

Anteprima autonoma in `menu/index.html`, con 17 Pizze della Tradizione dalle pagine 4-6 del PDF autunnale e 8 varianti Ruota di Carro dalle pagine 16-17.
La gallery pubblicata non è ancora collegata all'anteprima. Le altre categorie sono predisposte ma non ancora popolate.
Prezzi e testi italiano/inglese sono trascritti dal PDF. La copertina Margherita è usata nell'intestazione della categoria; le foto individuali non sono ancora associate.
I codici allergeni sono da verificare: il documento non include la legenda e contiene incongruenze registrate in `data/review.json`.

## Struttura

```text
menu/
  index.html          Anteprima autonoma
  data/
    config.json       Impostazioni e percorsi delle risorse
    catalog.json      Categorie e dati condivisi dei piatti
    editions.json     Stagioni e coperto
    review.json       Informazioni da verificare
  locales/
    it.json           Testi italiani
    en.json           Testi inglesi
  assets/
    css/              Stili responsive
    js/               Caricamento, interazioni e controlli
  scripts/            Validazione dati e file collegati
  tests/              Test del catalogo
img/menu/
  thumbnails/         Miniature per le schede
  full/               Immagini grandi aperte su richiesta
pdf/menu_autunno.pdf   Fonte dei contenuti italiano/inglese
```

## Percorsi

I percorsi relativi in config.json si risolvono rispetto alla cartella `menu/`, anche se il futuro menu sarà avviato da `galleria.html`.
Il caricatore usa una base esplicita verso `menu/`, senza dipendere dalla cartella della pagina.
localesBasePath contiene i file `{language}.json`.

## Catalogo

Ogni categoria ha un id stabile e un ordine.
Ogni elemento di items contiene:
- id: identificatore stabile, minuscolo e con trattini.
- categoryId: id di una categoria esistente.
- priceCents: prezzo intero in centesimi di euro (1200 significa 12,00 EUR).
- thumbnail: nome del file nella cartella thumbnails.
- image: nome del file nella cartella full; null se non disponibile.
- allergenCodes: codici come riportati nel PDF; null se non presenti.
- allergenStatus: pending-review oppure verified; verified richiede anche una legenda verificata.
- available: disponibilità del piatto.
- order: posizione nella categoria.
- editionIds: stagioni in cui compare il piatto.
- variants: formati con prezzo assoluto, disponibilità, codici allergeni e fonte propri.
- supplementIds: riferimenti all'elenco condiviso supplements, inizialmente vuoto.
- source: percorso PDF e pagina di origine.

I nomi dei file delle immagini devono seguire l'id del piatto, per esempio `margherita.webp`.
Prezzi, immagini e codici allergeni non si duplicano nei file delle lingue.
Non utilizzare un elenco allergeni vuoto per rappresentare informazioni mancanti.

## Traduzioni

In ogni file lingua, `items[id]` contiene `name` e `description` (ingredienti completi come nel PDF). I nomi originali delle pizze restano condivisi tra le lingue.
Le categorie hanno gli stessi id del catalogo.
Italiano e inglese partono dal PDF, senza inventare ingredienti o prezzi.
Per aggiungere una lingua creare il relativo JSON, completarlo e abilitarlo in config.json solo dopo la revisione. Aggiornare anche le opzioni dei due selettori in index.html.
Il modello prevede un fallback italiano; i controlli richiedono i campi essenziali in tutte le lingue abilitate. Il cambio lingua conserva categoria, piatto e formato. I parametri URL lang, category, item e variant riaprono lo stesso dettaglio.
Le traduzioni dei codici allergeni verranno aggiunte dopo aver verificato la legenda del PDF.

## Immagini e caricamento

- Miniature: obiettivo indicativo 30-60 KB ciascuna, da verificare sulle foto reali.
- Foto grandi: file separati, richiesti soltanto all'apertura del dettaglio.
- Le miniature si caricano vicino allo scorrimento; le immagini mancanti non impediscono la lettura.
- Cambiare lingua non deve scaricare nuovamente le fotografie.
- Le risorse del vecchio menu e della galleria restano nella loro posizione.

## Passi successivi

1. Verificare i punti in review.json e la legenda allergeni con il ristorante.
2. Preparare e associare le immagini effettive dei piatti.
3. Trascrivere le altre categorie e completare la revisione bilingue.
4. Collegare galleria.html quando il menu completo è pronto.

## Stagioni, disponibilità e supplementi

activeEdition in config.json seleziona l'edizione in editions.json; soltanto i piatti associati a quella stagione sono mostrati. Per una stagione con prezzi o ricette diversi usare nuovi record con id distinti, preservando quelli delle edizioni archiviate.
available: false mantiene visibile il piatto con l'indicazione di non disponibilità.
Il catalogo prevede supplementi condivisi con prezzi confermati. Il relativo selettore si implementerà quando saranno disponibili i dati.
Nessun filtro alimentare è attivo finché legenda e codici allergeni non saranno verificati.

## Controlli

Dalla cartella principale del repository:

```text
node menu/scripts/validate.mjs
node --test menu/tests/model.test.mjs
```

I controlli verificano prezzi, id unici, categorie e stagioni esistenti, traduzioni, varianti, codici allergeni e presenza dei file collegati.
Il workflow .github/workflows/menu-check.yml esegue i controlli alle modifiche del menu. È separato dal deploy GitHub Pages e non ne blocca automaticamente la pubblicazione.
Per la prova locale servire la cartella principale con un server HTTP e aprire /menu/; il caricamento JSON non funziona aprendo il file direttamente dal disco.
