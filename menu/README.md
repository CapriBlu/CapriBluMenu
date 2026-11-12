# Menu completo Capri Blu Sorrento

Il menu interattivo comprende 119 voci del PDF autunnale in 17 reparti, 14 opzioni di formato/prezzo e otto lingue (it, en, es, pt, pl, de, fr, vi). I prezzi sono in centesimi e ciascuna voce conserva pagina e file PDF di origine.

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

## Ottimizzazione telefono — 11 novembre 2026

Su telefono la navigazione occupa due righe: ritorno/selettore e scorciatoie scorrevoli. Il comando dello sfondo si trova accanto al PDF e non copre le schede. Le schede mantengono due colonne con foto separata da nome e ingredienti; la scheda aperta conserva il testo completo. Intestazione più compatta e ricerca a 16px per evitare lo zoom automatico sui browser mobili.

Il video viene avviato dopo il rendering del menu, in un momento libero del browser. Non parte automaticamente con risparmio dati, connessione 2G o movimento ridotto; resta avviabile manualmente. Le copertine dei reparti non vengono create quando è visibile una lista di piatti. Questi interventi riducono la concorrenza iniziale delle risorse; non costituiscono una misurazione dei tempi su rete mobile reale.

## Navigazione compatta telefono — 12 novembre 2026

La barra completa scorre con la pagina. Dopo che è uscita dallo schermo compare in alto un unico comando “Categorie · reparto attuale”. Apre un pannello con tutti i 17 reparti e il ritorno alla panoramica; la scelta chiude il pannello e porta al titolo del reparto. Il comando segue la lingua selezionata e scompare tornando alla barra completa. Su desktop resta la navigazione precedente.

## Correzione navigazione e sfondo — 12 novembre 2026

Su telefono la barra grande è sostituita fin dall'inizio da un unico selettore di reparto sopra i piatti. Il selettore occupa il proprio spazio nel flusso e resta raggiungibile con il contenitore sticky; non fluttua sulle schede. Il pulsante Pausa sfondo è rimosso dal markup e dal codice. Il video mantiene avvio differito, sospensione in background e rispetto di movimento ridotto/risparmio dati. Questa scelta sostituisce il comportamento descritto negli aggiornamenti precedenti.

## Polacco, tedesco, francese e vietnamita — 12 novembre 2026

Aggiunti pl/de/fr/vi per tutte le 119 voci, 17 reparti, testi dell'interfaccia, opzioni e frasi del marchio. Home con otto bandiere e selettori aggiornati anche nel dettaglio. I nomi tradizionali restano italiani; ingredienti e nomi generici sono tradotti dal riferimento italiano, senza aggiungere ingredienti non presenti. Le traduzioni nuove sono redazionali e non risultano revisionate da madrelingua.

All'avvio si scaricano soltanto la lingua scelta e il fallback italiano. Le altre lingue si scaricano alla selezione e vengono riutilizzate nella sessione; un errore permette di ritentare mantenendo la lingua precedente. Supportati formati monetari locali, ricerca vietnamita senza diacritici e plurale polacco. PDF e carta dei vini storica restano nelle rispettive lingue originali.
