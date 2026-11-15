# Struttura del sito

## Pagine e dati
- `index.html`: struttura della home; `script/home-entry.js` gestisce accesso al menu e lingua.
- `shop.html` + `script/boutique.mjs`: vetrina e interazioni Boutique.
- `vini.html` + `script/cellar.mjs`: filtri e carosello vini.
- `data/boutique-products.json` e `data/wines.json`: cataloghi, prezzi, immagini e identificatori stabili. Le miniature sono generate da questi cataloghi.
- Il menu interattivo conserva la sua struttura in `menu/`.

## Lingue
`script/site-language.mjs` carica italiano e lingua selezionata, applica solo i collegamenti `data-i18n` espliciti e localizza i campi dei cataloghi. Le chiavi in `site-locales/` sono stabili: modificare il valore di una frase, non la chiave. Non cercare testi italiani nel documento e non usare osservatori globali per tradurre.

Nomi commerciali e denominazioni rimangono originali. Mantenere ogni chiave in tutte le otto lingue. L’italiano è il ripiego se una traduzione non è disponibile. L’HTML contiene il contenuto iniziale come ripiego di lettura; i dati interattivi provengono dai cataloghi.

## Animazione
`script/bird-motion.mjs` produce solo fotogrammi e durata, senza accedere alla pagina. `script/boutique-bird.mjs` gestisce avvio, fine, visibilità e movimento ridotto. Il logo originale rimane separato dalla mascotte.

## Stili e video
Gli stili di ogni pagina sono nel relativo CSS. Conservare l’ordine della cascata e le condizioni responsive; correggere la regola esistente invece di aggiungere nuove correzioni in fondo. Gli stili inutilizzati del caricamento Boutique sono rimossi.

`script/site-background.js` è l’unico gestore dei video di home, vini e Boutique: sceglie una fonte, aspetta il rendering iniziale e rispetta movimento ridotto e risparmio dati.

## Controlli prima della pubblicazione
```
node menu/scripts/validate.mjs
node --test menu/tests/*.test.mjs script/tests/*.test.mjs
```
Controllare anche desktop e telefono: cambio prodotti, filtri, lingua, ritorni al menu e posa finale della mascotte. Confrontare misure e aspetto con la versione online per modifiche agli stili.

Aggiornare la versione dei file modificati nei riferimenti HTML e la versione dei dati in `script/site-language.mjs` quando cambiano cataloghi o traduzioni. I moduli importati condivisi devono avere riferimenti aggiornati quando necessario.
