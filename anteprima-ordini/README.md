# Anteprima ordini su GitHub Pages

Questa cartella e una **demo autonoma** per provare il menu ordini nel browser senza ChatGPT Sites e senza backend.

Percorso previsto con GitHub Pages attivo: `https://capriblu.github.io/CapriBluMenu/anteprima-ordini/`

## Cosa funziona
- Catalogo pubblico esistente e immagini della stessa repository (non ci sono copie di dati).
- Scelta reparto, ricerca, 8 lingue, formati/prezzi, aggiunta al carrello, quantita e totale.
- Carrello temporaneo in sessionStorage, svuotato con la sessione del browser.
- Grafica blu semitrasparente per test su smartphone.

## Cosa non funziona (intenzionalmente)
- Nessun ordine viene ricevuto, inoltrato, confermato, registrato o pagato.
- Non sono chiamate API ordini, WhatsApp, operatori, autenticazione o Cloudflare D1.
- Nessuna raccolta di indirizzi, nomi o telefoni.
- Le condizioni di consegna/attesa e la disponibilita reale non sono garantite.
- Le regole ordini e gli adattamenti dettagliati del repository privato CapriBluOrdini non sono duplicati; questa e una demo autonoma, non la versione di produzione.

## Confini
Non toccare menu/index.html o le risorse originali. La demo carica ../menu/data/catalog.json e ../menu/locales/*.json e riutilizza immagini e PDF gia pubblicati. I prezzi e le traduzioni sono quelli del catalogo originale, non un listino operativo verificato. Le categorie non disponibili nell'app ordini (spritz, vino alla mescita, birra alla spina) sono escluse per sicurezza.

La distribuzione completa resta ChatGPT Sites (progetto Ordini Capri Blu Sorrento) e richiede il suo flusso di pubblicazione.
