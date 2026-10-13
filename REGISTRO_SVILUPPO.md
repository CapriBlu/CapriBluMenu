# Registro dello sviluppo — CapriBluMenu

Registro cronologico degli interventi sul repository `CapriBlu/CapriBluMenu`. Dopo ogni aggiornamento aggiungere una voce con data, obiettivo, modifiche, verifiche, commit e attività successive.

## 13 ottobre 2026 — Chiusura audit e ottimizzazione risorse

**Stato:** completato; funzionamento confermato dall'utente.
**Branch:** `audit/cleanup-capriblumenu` (il branch `main` non è stato modificato).
**Ultimo commit funzionale:** `0f7e589`.

### Modifiche
1. Corretti 27 riferimenti a immagini mancanti e favicon.
2. Separati CSS e JavaScript incorporati nella Boutique nei file `shop-inline.css` e `script/shop.js`.
3. Migliorato il caricamento delle risorse, inclusi video e immagini.
4. Convertite sette immagini Galleria JPG in WebP con fallback originali: da 17,98 a 2,54 MiB (circa -85,9%). Commit `d73a0df`.
5. Convertite sette immagini Boutique PNG in WebP mantenendo gli originali: da circa 14,8 a 1,18 MB (circa -92%). Commit `418ac01`.
6. Ottimizzato il video desktop H.264 Full HD 30 FPS: da 21,61 a 11,50 MiB (circa -46,8%). Aggiornati `index.html`, `galleria.html` e `shop.html`; mantenuti video originale e WebM mobile. Commit `0f7e589`.

### Verifiche
- L'utente ha confermato il corretto funzionamento di Home, Galleria e Boutique.
- Modifiche pubblicate sul branch di audit, senza merge su `main`.
- Prima di questo registro: branch di audit 23 commit avanti, 0 indietro rispetto a `main`.
- Il video temporaneo locale `img/capri_blu_pc_25s_1080p_test.mp4` non è stato pubblicato; la sua rimozione locale non è verificata.
- Non sono ancora stati eseguiti benchmark Lighthouse/PageSpeed.

### Prossima fase (non avviata)
**Fase 7:** misurazione prestazioni desktop/mobile e diagnosi risorse bloccanti, CSS/JS e stabilità visiva. Nessuna modifica avviata.

---

## 13 ottobre 2026 — Drink Collection, prima bozza

**Stato:** bozza HTML/CSS creata, non ancora verificata dall'utente.
**Branch:** `audit/cleanup-capriblumenu`.

### Interventi
- Analizzata la struttura di `shop.html`, il video di sfondo e il collegamento Drink Menu esistente nella Home.
- Creati `drink.html` e `drink.css`, con video desktop/mobile esistenti, navigazione per categorie, schede responsive e animazioni CSS leggere.
- Inseriti soft drink, acqua, birre, selezione N'Artigiana, spritz e sezione di anteprima vini.
- Prezzi inseriti solo dove comunicati: soft drink €2,50; acqua plastica 0,5 L €1,50; Capri Blu 0,75 L €2,50; acqua plastica 1 L €3,00; birre da listino. Prezzi mancanti esplicitamente indicati come da definire.
- L'acqua Capri Blu utilizza un'immagine già presente nella Boutique; le altre bevande usano simboli temporanei, in attesa delle illustrazioni realistiche in stile mediterraneo.
- La vetrina vini separata `vini.html` non è ancora stata creata.
- **Il pulsante Drink Menu nella Home non è stato modificato**: attende la verifica della nuova pagina prima di sostituire il PDF.

### Verifiche e prossimi passi
- Commit prima bozza: `633eb60` (HTML), `3e88c00` (CSS).
- Da verificare su smartphone e desktop; nessun test visivo conclusivo ancora eseguito.
- Da completare: immagini personalizzate, prezzi mancanti, conferma Ichnusa, vetrina vini e collegamento dalla Home.

---

## 13 ottobre 2026 — Drink Collection, proporzioni v2

**Stato:** CSS aggiornato; verifica visiva dell'utente ancora da effettuare.
**Riferimento:** commit `56c7b8e`.

- Esaminato il video di navigazione condiviso dall'utente.
- Logo nell'intestazione aumentato in modo marcato e reso responsivo.
- Griglia desktop limitata a quattro colonne, tablet a tre e smartphone a due per migliorare proporzioni e leggibilità.
- Ritoccati spaziature, altezza delle schede e dimensioni di testo/illustrazioni.
- Nessuna modifica al catalogo, ai prezzi o al pulsante Home; `main` resta invariato.
- Da verificare: resa visiva su desktop e telefono; illustrazioni definitive ancora da realizzare.

---

## 13 ottobre 2026 — Drink Collection, navigazione e logo v3

**Stato:** implementato, in attesa di verifica visiva.
**Commit:** `fe3b2db` (HTML), `37987d0` (CSS).

- Spostata la barra delle categorie sopra il logo e integrato al suo interno il collegamento «Torna al menu».
- Aggiunto un alone bianco sfumato dietro al logo per separarlo dal video senza alterare la dimensione approvata.
- Barra di navigazione mantenuta sticky; su schermi piccoli il pulsante indietro occupa una riga per garantire la leggibilità.
- Aggiornata la versione del foglio di stile per evitare la cache precedente.
- Nessun cambiamento a prezzi, catalogo o pulsante Drink Menu della Home; `main` invariato.

---

## 13 ottobre 2026 — Drink Collection, medaglione e navigazione v4

**Stato:** implementato; verifica visiva da effettuare.
**Commit:** `232eba8` (HTML), `19b076b` (CSS).

- Eliminato l'alone diffuso dietro il logo e inserito il marchio in una card ovale semitrasparente con bordo sottile, sfocatura del video e ombra delicata.
- Centrati i pulsanti dei reparti nella barra superiore, mantenendo il pulsante «Torna al menu» separato a sinistra su desktop.
- Su tablet e smartphone, il pulsante indietro occupa una riga dedicata e le categorie restano centrate.
- Aggiornato il parametro di versione CSS a `v=4`; nessuna modifica a prezzi, catalogo o Home.

---

## 13 ottobre 2026 — Drink Collection, fascia panoramica v5

**Stato:** implementato, da verificare visivamente.
**Commit:** `ae78691` (CSS), `e24fad3` (versione foglio di stile).

- Sostituita la card ovale con una fascia orizzontale in vetro satinato, semitrasparente, coordinata con la barra superiore.
- Eliminati il doppio bordo e l'alone circolare; mantenuto il logo centrato e ben visibile.
- Resa l'intestazione leggermente più compatta e ridotto il titolo per migliorare la gerarchia visiva.
- Navigazione e catalogo invariati; il pulsante della Home continua a puntare al PDF fino all'approvazione.

---

## 13 ottobre 2026 — Drink Collection, vetrina continua v6

**Stato:** implementato, in attesa di verifica visiva.
**Commit:** `9b32ac3` (HTML), `ae0ce8e` (CSS).

- Trasformata la fascia del logo in un'unica superficie semitrasparente che racchiude logo, contenuti e footer; video di Capri visibile sullo sfondo.
- Rimossa la scritta «Capri Blu Sorrento» sopra il titolo e rimosso il titolo «Drink Collection» dall'intestazione; mantenuti logo, breve sottotitolo e ornamento.
- Mantenuta la navigazione superiore esterna alla vetrina e centrata.
- Regolati trasparenza, sfocatura e spaziature, con sfocatura più leggera su smartphone e fallback per preferenza di trasparenza ridotta.
- Catalogo e prezzi invariati; il pulsante Home resta collegato al PDF fino alla verifica.

---

## 13 ottobre 2026 — Drink Collection, logo su vetro cristallo v7

**Stato:** implementato, verifica visiva in attesa.
**Commit:** `42df3b4` (CSS), `4469881` (cache CSS).

- Dallo screenshot il logo appariva poco leggibile sul fondo blu scuro della vetrina.
- Introdotta una piccola superficie in vetro chiaro satinato dietro al logo, con bordo singolo discreto, riflesso e blur, senza ripristinare la precedente forma ovale.
- Il marchio resta quasi completamente opaco per mantenere leggibili le lettere blu; l'effetto semitrasparente riguarda soprattutto il vetro dietro di esso.
- Invariati layout generale, navigazione, catalogo e prezzi.

---

## 13 ottobre 2026 — Drink Collection, vetro uniforme v8

**Stato:** implementato, verifica visiva da effettuare.
**Commit:** `7eaa102` (HTML), `e53047c` (CSS).

- Rimossa la card chiara separata attorno al logo: il logo ora è inserito direttamente nella stessa superficie di vetro semitrasparente che racchiude tutta la pagina.
- Resa più luminosa e uniforme la vetrina principale, mantenendo il video sullo sfondo.
- Eliminate le diciture decorative «Un sorso di Costiera, tra tradizione e freschezza.» e «Freschezza mediterranea», oltre al piccolo ornamento sotto il logo.
- Ridotta la distanza verticale tra logo e sezione Soft Drink.
- Navigazione, prodotti, prezzi e Home invariati; `main` non modificato.

---

## Modello per nuove voci

### AAAA-MM-GG — Titolo
- **Obiettivo:**
- **Branch e punto di partenza:**
- **File modificati:**
- **Interventi:**
- **Test e risultati:**
- **Commit:**
- **Questioni aperte:**
- **Prossima attività:**
