# Foto del menu Capri Blu

Ogni reparto ha una cartella propria, con due sottocartelle:

- `thumbnails/`: miniature leggere per le schede del menu.
- `full/`: fotografie grandi per il dettaglio del piatto.

## Reparti

| Cartella | Intestazione nel PDF autunnale | Pagine |
|---|---|---|
| `fritti/` | I Fritti | 12 |
| `antipasti/` | Antipasti | 8 |
| `antipasti-mare/` | Antipasti di Mare | 8 |
| `primi/` | Primi Piatti | 9 |
| `primi-mare/` | Primi Piatti di Mare | 10 |
| `secondi-terra/` | Secondi di Terra | 11 |
| `secondi-mare/` | Secondi di Mare | 11 |
| `pizze-tradizione/` | Pizze | 4, 5, 6 |
| `firmate-capri-blu/` | Firmate Capri Blu | 1, 2 |
| `montanare/` | Montanare | 3 |
| `rutiello-pizza/` | Rutiello | 13 |
| `ruota-di-carro/` | Ruota di Carro | 16, 17 |
| `contorni/` | Contorni | 14 |
| `insalatone/` | Insalatone | 14 |
| `dessert/` | Dessert | 15 |
| `drinks-beverage/` | Drinks & Beverage | 7 |
| `spritz/` | Our Spritz | 7 |

## Esempio: Margherita

```text
img/menu/pizze-tradizione/thumbnails/margherita.webp
img/menu/pizze-tradizione/full/margherita.webp
```

Usare nomi minuscoli senza spazi, accenti o simboli; separare le parole con trattini.
Il nome del file dovrebbe corrispondere all'id del piatto nel catalogo.
Formati supportati: WebP, AVIF, JPG, JPEG e PNG. Per le miniature il peso obiettivo resta 30-60 KB, da verificare sulle foto reali.
Le due versioni sono file distinti, anche quando hanno lo stesso nome.

Per un formato diverso usare la cartella del relativo reparto, per esempio
`ruota-di-carro/full/margherita.webp`. La sola creazione delle cartelle non modifica le schede o le varianti.

## Collegamento al menu

Caricare una fotografia non la associa automaticamente a un piatto.
Nel relativo record di `menu/data/catalog.json` impostare i percorsi relativi a questa cartella:

```json
{
  "thumbnail": "pizze-tradizione/thumbnails/margherita.webp",
  "image": "pizze-tradizione/full/margherita.webp"
}
```

Non impostare i percorsi prima di aver caricato i file: i controlli segnalano le immagini mancanti.
Le foto sono condivise tra tutte le lingue.
Le prime 11 pizze tradizionali sono già associate: i file WebP con nome corrispondente all'id sono le versioni usate dal menu. Gli originali JPG/JPEG/PNG caricati sono conservati e registrati in photoSource nel catalogo; non vengono scaricati durante la consultazione.
"Broccoli e Salsiccia.jpg" è associata a Salsiccia e Friarielli. Per ulteriori caricamenti mantenere il nome del piatto, così da identificarlo senza ambiguità.
I file `.gitkeep` servono a mantenere le cartelle vuote su GitHub e possono rimanere anche dopo il caricamento delle foto.
