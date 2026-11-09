# Menu interattivo Capri Blu

Base di cartelle e dati per la futura evoluzione di `galleria.html`.
La navigazione pubblicata non è ancora collegata a questi file.
Il catalogo non contiene piatti: prezzi, ingredienti e traduzioni italiano/inglese vanno trascritti e verificati dal PDF autunnale.

## Struttura

```text
menu/
  data/
    config.json       Impostazioni e percorsi delle risorse
    catalog.json      Categorie e dati condivisi dei piatti
  locales/
    it.json           Testi italiani
    en.json           Testi inglesi
  assets/
    css/              Futuri stili del menu
    js/               Futuri moduli del menu
img/menu/
  thumbnails/         Miniature per le schede
  full/               Immagini grandi aperte su richiesta
pdf/menu_autunno.pdf   Fonte dei contenuti italiano/inglese
```

## Percorsi

I percorsi relativi in config.json si risolvono rispetto alla cartella `menu/`, anche se il futuro menu sarà avviato da `galleria.html`.
Il caricatore dovrà quindi usare una base esplicita verso `menu/`, senza dipendere dalla cartella della pagina.
localesBasePath contiene i file `{language}.json`.

## Catalogo

Ogni categoria ha un id stabile e un ordine.
Ogni futuro elemento di items avrà:
- id: identificatore stabile, minuscolo e con trattini.
- categoryId: id di una categoria esistente.
- priceCents: prezzo intero in centesimi di euro (1200 significa 12,00 EUR).
- thumbnail: nome del file nella cartella thumbnails.
- image: nome del file nella cartella full; null se non disponibile.
- allergenCodes: elenco di codici verificati; null finché non verificati.
- available: disponibilità del piatto.
- order: posizione nella categoria.

I nomi dei file delle immagini devono seguire l'id del piatto, per esempio `margherita.webp`.
Prezzi, immagini e codici allergeni non si duplicano nei file delle lingue.
Non utilizzare un elenco allergeni vuoto per rappresentare informazioni mancanti.

## Traduzioni

In ogni file lingua, `items[id]` conterrà `name`, `description` e `ingredients` (elenco di testi).
Le categorie hanno gli stessi id del catalogo.
Italiano e inglese partono dal PDF, senza inventare ingredienti o prezzi.
Per aggiungere una lingua creare il relativo JSON e abilitarla in config.json solo dopo la revisione.
Il futuro caricatore userà la lingua di fallback per i testi mancanti e conserverà categoria e piatto selezionati al cambio lingua.
Le traduzioni dei codici allergeni verranno aggiunte dopo aver verificato la legenda del PDF.

## Immagini e caricamento

- Miniature: obiettivo indicativo 30-60 KB ciascuna, da verificare sulle foto reali.
- Foto grandi: file separati, richiesti soltanto all'apertura del dettaglio.
- Le prime miniature visibili si caricano subito; quelle successive vicino allo scorrimento.
- Cambiare lingua non deve scaricare nuovamente le fotografie.
- Le risorse del vecchio menu e della galleria restano nella loro posizione.

## Passi successivi

1. Trascrivere il catalogo e i testi italiano/inglese dal PDF.
2. Preparare e associare le immagini dei piatti.
3. Implementare i moduli di caricamento, cambio lingua, filtri e dettaglio.
4. Collegare galleria.html dopo la verifica del menu interattivo.
