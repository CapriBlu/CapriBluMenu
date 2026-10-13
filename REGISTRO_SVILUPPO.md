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
