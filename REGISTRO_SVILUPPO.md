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
