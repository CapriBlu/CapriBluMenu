# Menu completo Capri Blu Sorrento

Il menu interattivo comprende 119 voci del PDF autunnale in 17 reparti, 14 opzioni di formato/prezzo e quattro lingue (it, en, es, pt). I prezzi sono in centesimi e ciascuna voce conserva pagina e file PDF di origine.

## Navigazione

La pagina /menu/ apre la scelta dei reparti, organizzati in Pizzeria, Cucina e Da bere. Si possono cercare nomi o ingredienti e passare tra reparti dal selettore. I collegamenti diretti con lang, category, item, variant e q rimangono supportati. Le schede consentono di sfogliare le proposte con frecce e tastiera. La lingua viene mantenuta; la home conserva l'invito in vetro approvato.

Il catalogo include cibo, soft drink, birre, vino locale/prosecco e spritz del PDF. La carta dei vini separata resta collegata a ../vini.html.

## Immagini

69 foto sono associate per corrispondenza del nome, comprese le immagini gia presenti. Le nuove associazioni usano img/menu/biblioteca/ e le copie WebP ottimizzate. Le miniature si caricano in prossimita dello scorrimento; le versioni grandi solo aprendo la scheda. Le foto non corrispondenti al menu autunnale rimangono in biblioteca senza essere pubblicate come piatti diversi.

Le schede senza foto restano consultabili con nome, ingredienti e prezzo. Non sono riutilizzate foto delle pizze tradizionali per rappresentare il formato Ruota di Carro.

## Contenuti e revisione

Il menu deriva da pdf/menu_autunno.pdf, pagine 1-18. L'italiano e il riferimento principale. L'inglese segue il PDF con normalizzazione dei refusi e senza riprodurre contraddizioni sostanziali; spagnolo e portoghese sono traduzioni dei contenuti. I nomi tradizionali dei piatti restano italiani, mentre i nomi generici delle bevande e dei contorni sono localizzati.

Le incongruenze del PDF sono in data/review.json (scaloppina pollo/vitello, gusti frittatine, codici allergeni). I codici allergeni restano pending-review e non sono presentati come verificati. Nessun filtro dietetico dedotto dagli ingredienti e attivo. L'opzione Patate Dippers con maionese al lime mantiene il prezzo di 8,90 EUR; gli altri condimenti sono al prezzo base di 8,00 EUR.

## Dati

- data/catalog.json: reparti, gruppi, prezzi, formati, immagini e fonti.
- locales/{it,en,es,pt}.json: interfaccia e contenuti tradotti.
- data/config.json: stagione attiva e lingue.
- data/review.json: punti da verificare con il ristorante.

I percorsi immagini possono essere reparto/thumbnails/file.webp oppure biblioteca/reparto/thumbnails/file.webp (e full/ per le immagini grandi). I percorsi fuori dai reparti previsti e gli attraversamenti di directory sono rifiutati.

## Verifica

Dalla radice del repository:

\`\`\`text
node menu/scripts/validate.mjs
node --test menu/tests/*.test.mjs
node --check menu/assets/js/menu.js
\`\`\`

I controlli verificano dati, traduzioni, fonti, presenza dei file, separazione dei formati e prezzi chiave. Servire il repository con un server HTTP per la prova locale; non aprire il file direttamente dal disco.
