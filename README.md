# Léo Guy — Portfolio

Site statique. HTML / CSS / JS, aucun build, aucune dépendance à installer.
Direction artistique inspirée de [ilcapoproduction.com](https://www.ilcapoproduction.com) : noir et rouge, typographie éditoriale, scroll cinématique.

## Structure

```
index.html            page unique
css/styles.css
js/main.js            GSAP ScrollTrigger + Lenis
data/projects.js      ← les 33 projets : c'est ici qu'on modifie
assets/
  videos/showreel.mp4         fond du hero — 1600px, 18 Mo
  videos/showreel-mobile.mp4  variante ≤820px — 960px, 7 Mo
  loops/*.mp4                 boucles muettes de 13 s jouées au scroll
  img/posters/*.jpg           image d'attente de chaque boucle
  img/showreel-poster.jpg     = 1re image du showreel (aucun saut au démarrage)
_originaux/           vidéos sources — non versionné
```

## Le showreel du hero

Source : `_originaux/SHOWREEL 0926.mp4` — 76 Mo, 1620×1080, 71 s, 8,4 Mbps.
Trop lourd tel quel : le frein à la fluidité n'est pas le décodage (H.264 passe partout)
mais le **débit**, qui fait bufferiser sur connexion moyenne.

Réencodage :

```bash
# desktop — 1600px, 18 Mo, 1,9 Mbps
ffmpeg -y -i "_originaux/SHOWREEL 0926.mp4" -an \
  -vf "scale=1600:-2" -c:v libx264 -profile:v high -level 4.1 -preset slow -crf 28 \
  -aq-mode 3 -aq-strength 1.1 -maxrate 4M -bufsize 8M -g 50 -keyint_min 25 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart assets/videos/showreel.mp4

# mobile — 960px, 7 Mo, 0,7 Mbps
ffmpeg -y -i "_originaux/SHOWREEL 0926.mp4" -an \
  -vf "scale=960:-2" -c:v libx264 -profile:v main -level 3.1 -preset slow -crf 30 \
  -aq-mode 3 -aq-strength 1.1 -maxrate 1600k -bufsize 3200k -g 50 -keyint_min 25 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart assets/videos/showreel-mobile.mp4

# poster = première image, pour qu'il n'y ait aucun saut au démarrage
ffmpeg -y -i assets/videos/showreel.mp4 -frames:v 1 -q:v 3 assets/img/showreel-poster.jpg
```

Pourquoi ces réglages :
- `aq-mode 3` + `aq-strength 1.1` — l'ouverture du showreel est très sombre ; sans ça
  x264 écrase les noirs et fait du banding. **L'intro sombre est voulue, ne pas la couper.**
- `maxrate` / `bufsize` — plafonne les pics de débit, c'est eux qui provoquent les coupures.
- `faststart` — l'index est placé en tête, la lecture démarre sans attendre le fichier entier.
- `-g 50` — une image-clé toutes les 2 s, la boucle repart net.

Côté lecture, trois choses assurent la fluidité :
1. La variante mobile est servie aux écrans ≤820px (`<source media>`).
2. Le showreel se met en pause dès qu'on quitte le hero — inutile de décoder du 1600px
   pendant qu'on scrolle les 33 projets.
3. Chaque boucle de projet est préchargée un écran à l'avance, puis jouée seulement à l'écran.

## Développement

```bash
npx serve .
```

Pour réordonner les projets avec l'éditeur visuel (glisser-déposer + sauvegarde
automatique dans `data/order.js`) :

```bash
python3 tools/order_editor.py
```

Puis ouvrir `http://127.0.0.1:4173/_ordre.html`.

## Modifier les projets

Tout se passe dans `data/projects.js`. Un projet :

```js
{ n:"09", cat:"musique", client:"Tayc", title:"Ma Lady",
  role:"Directeur de production", yt:"7Ai7IrxO7Hg", loop:"tayc" }
```

| Champ | Rôle |
|---|---|
| `n` | numéro affiché à gauche de l'interstitiel rouge |
| `cat` | `"musique"` ou `"fashion"` — sert aux filtres du menu |
| `client` / `title` | en-tête noir sur le rouge, puis titre rouge en plein écran |
| `role` | affiché sous le titre |
| `yt` | ID YouTube → vignette + lien au clic. Vide = état « vidéo à venir » |
| `loop` | nom du fichier dans `assets/loops/` (sans `.mp4`). Absent → vignette YouTube fixe |

L'ordre du tableau = l'ordre sur le site.

## Ajouter une boucle vidéo

Déposer la vidéo source, puis :

```bash
ffmpeg -y -ss 60 -t 13 -i source.mp4 -an -vf "scale=1280:-2" -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -movflags +faststart assets/loops/nom.mp4
ffmpeg -y -ss 1 -i assets/loops/nom.mp4 -frames:v 1 -vf "scale=960:-2" -q:v 5 assets/img/posters/nom.jpg
```

`-ss 60` = début de l'extrait. Puis ajouter `loop:"nom"` au projet.

## État des vidéos

**41 projets** — 17 musique, 24 fashion. **22 ont une vraie boucle vidéo**,
les 19 autres affichent la vignette YouTube (image fixe, légère respiration).
Pour en passer une en vidéo : déposer la source et suivre « Ajouter une boucle » ci-dessus.

**Manque le lien YouTube** de Gradur — Décennie : la boucle tourne, mais le clic n'ouvre rien.

**Sources présentes mais inutilisées** dans `SHOWREEL/` :
King Promise — Bad Habits, et 4 fichiers `SaveClip.App_…` non identifiables.

**Écarté volontairement** : KENZO SS 2026 « Best of the Show » (`OVqu7XTFDSY`),
sur demande de Léo.

## Composition d'un projet

Fonds **alternés** : projet 01 rouge, 02 noir, 03 rouge… L'alternance est posée en JS
(`project--dark` / `project--red` selon la parité de l'index), le numéro s'adapte
automatiquement (noir sur rouge, blanc sur noir).

Sur la vidéo en plein écran : **titre en haut, client en bas**, tous deux en rouge.
Aucun texte noir au-dessus des boucles.

## Interactions

| Élément | Comportement |
|---|---|
| **Contact** (haut gauche) | ouvre un mail vers `leo.guy@hotel1920.com` |
| **Menu** (haut droite) | overlay rouge ; le wordmark « LÉO GUY » ramène en haut de l'accueil |
| **Curseur** | pastille rouge à texte noir : « SCROLL » sur la page, « VIEW » sur un projet, masquée sur les boutons |
| **Clic sur un projet** | ouvre la vidéo complète sur YouTube |

Le menu porte `data-lenis-prevent` : sans cet attribut Lenis capte la molette
et l'index des projets ne défile pas.

Les vignettes du menu viennent de YouTube (`hqdefault`). Quand YouTube n'en a pas
(il renvoie alors une image grise de 120px, pas un 404), le script bascule
automatiquement sur le poster local — c'est le cas des deux Genezio.

## Déploiement

Le site est **100 % statique** : c'est le cas le plus simple et le plus rapide pour
GitHub et Vercel. Aucun build, aucune dépendance, aucun serveur — Vercel sert les
fichiers tels quels depuis son CDN.

### GitHub
```bash
git init
git add .
git commit -m "Portfolio Léo Guy"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

### Vercel
Add New → Project → importer le repo.
Framework preset **Other**, **pas de build command**, root `./`. C'est tout.

### Fichiers de configuration

| Fichier | Rôle |
|---|---|
| `vercel.json` | en-têtes de cache et de sécurité, URLs sans `.html` |
| `robots.txt` | autorise l'indexation, exclut les fichiers de travail |
| `404.html` | page d'erreur aux couleurs du site (Vercel la sert automatiquement) |
| `favicon.svg` | monogramme LG noir sur rouge |
| `.gitattributes` | marque les vidéos et images comme binaires |
| `.gitignore` | exclut `_originaux/` (40 Mo de sources) et les fichiers de travail |

### Cache

`vercel.json` met les fichiers de `/assets` en cache **7 jours** et les HTML/CSS/JS
en revalidation systématique. Conséquence à connaître : si tu **remplaces** une vidéo
sans changer son nom, les visiteurs récents peuvent voir l'ancienne pendant 7 jours.
Pour forcer la mise à jour, renomme le fichier (ex. `showreel-2.mp4`) et adapte le lien.

### Poids

**~60 Mo versionnés** (23 Mo de showreel + 37 Mo de boucles).
Le plus gros fichier fait 18 Mo, la limite GitHub est de 100 Mo par fichier.
Confortable, mais à surveiller : chaque réencodage d'une vidéo ajoute une nouvelle
copie dans l'historique Git. Si le dépôt devient lourd à cloner, la solution est
d'héberger les vidéos ailleurs (Vercel Blob, Cloudflare R2, Supabase Storage)
plutôt que d'utiliser Git LFS.

## Polices

Google Fonts : **Instrument Serif** (titres, substitut d'Ivar Display) et **Inter** (wordmark et labels).

## Accessibilité

`prefers-reduced-motion` désactive le smooth scroll et les animations de scale ;
les titres et vidéos restent visibles sans animation.
