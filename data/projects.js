/* =========================================================
   PROJETS — Portfolio Léo Guy
   Ordre validé par Léo (questionnaire du 01/09/2026)

   cat   : "musique" | "fashion"
   yt    : ID YouTube — la vignette du menu et le lien au clic en découlent
   loop  : fichier dans assets/loops/ — boucle muette jouée au scroll.
           Absent → on retombe sur la vignette YouTube (image fixe).

   Le numéro affiché (01, 02, …) est calculé automatiquement à partir de
   l'ordre de ce tableau : il n'y a rien à renuméroter en cas d'ajout.
   ========================================================= */

window.PROJECTS = [
  // ---------- MUSIQUE ----------
  { cat:"musique", client:"Angélique Kidjo × Pharrell Williams × Quavo", title:"Bando",
    role:"Coordination", yt:"TdLN4uqTJL4", loop:"bando" },

  { cat:"musique", client:"VALD × Vladimir Cauchemar × Todiefor", title:"Prozaczopixan",
    role:"Directeur de production", yt:"qjzD3LkrDSQ", loop:"vald" },

  { cat:"musique", client:"NeS", title:"Tout prendre",
    role:"Directeur de production", yt:"ezPmhs_psw8", loop:"nes" },

  { cat:"musique", client:"Rejjie Snow, Miso Extra", title:"Hypnotic Pickpocket",
    role:"Directeur de production", yt:"iivmLrmC0es", loop:"rejjie-snow" },

  { cat:"musique", client:"YoungBoy Never Broke Again", title:"Bruce Wayne",
    role:"Directeur de production · Coordination", yt:"2wI4_-aMSk0", loop:"youngboy" },

  { cat:"musique", client:"PLK", title:"Périph",
    role:"Assistant de production", yt:"HCJ2WHNpQqc", loop:"plk" },

  { cat:"musique", client:"Saint James × AVNIER", title:"Intervalle #1",
    role:"Directeur de production", yt:"YQ6wBpktQmo", loop:"intervalle" },

  { cat:"musique", client:"Ninho", title:"Boîte Noire",
    role:"Directeur de production", yt:"cMx0vsmoVtQ", loop:"ninho" },

  { cat:"musique", client:"Tayc", title:"Ma Lady",
    role:"Directeur de production", yt:"7Ai7IrxO7Hg", loop:"tayc" },

  { cat:"musique", client:"Bamby × Kerchak", title:"Pas Jalouse",
    role:"Directeur de production", yt:"vCRztEFJc50", loop:"bamby-kerchak" },

  { cat:"musique", client:"Genezio feat. Kalash", title:"La Meilleure",
    role:"Producteur exécutif", yt:"VGRE3Tu-IxI", loop:"genezio-la-meilleure" },

  { cat:"musique", client:"Genezio", title:"Dis-Moi",
    role:"Producteur exécutif", yt:"E345mAstUQo", loop:"genezio-dis-moi" },

  { cat:"musique", client:"Genezio", title:"Dans Mon Monde",
    role:"Producteur exécutif", yt:"orobyTIaxjc", loop:"genezio-dans-mon-monde" },

  // Ajouté le 01/09 — placé avec les autres Genezio puisque c'est la même série
  { cat:"musique", client:"Genezio", title:"Jusqu'au Soleil",
    role:"Producteur exécutif", yt:"cob7dO35PTU", loop:"genezio-jusquau-soleil" },

  { cat:"musique", client:"Vacra", title:"Agent secret",
    role:"Assistant de production", yt:"6Bg-Lt72BuA" },

  { cat:"musique", client:"Tiakola", title:"BDLM",
    role:"Assistant de production", yt:"L3deNvV9QDs", loop:"tiakola" },

  // Ajouté le 01/09 — placé en fin de bloc musique, à déplacer si besoin.
  // Lien YouTube encore manquant.
  { cat:"musique", client:"Gradur", title:"Décennie",
    role:"Directeur de production", yt:"", loop:"gradur" },

  // ---------- FASHION ----------
  { cat:"fashion", client:"Jean Paul Gaultier × Ludovic de Saint Sernin", title:"Haute Couture",
    role:"Coordination", yt:"7Nc4LN8OA8g", loop:"jpg" },

  { cat:"fashion", client:"LOEWE", title:"Spring Summer 2025",
    role:"Coordination", yt:"wqZby80VMq0" },

  { cat:"fashion", client:"Schiaparelli", title:"Spring/Summer 2025 RTW",
    role:"Coordination", yt:"bqeJZghMNfo" },

  { cat:"fashion", client:"Comme des Garçons", title:"Spring/Summer 2025",
    role:"Coordination", yt:"MaRwXpILbvY", loop:"cdg-ss2025" },

  { cat:"fashion", client:"Schiaparelli", title:"Haute Couture SS 2025",
    role:"Coordination", yt:"g9qWDkA_1aQ", loop:"schiaparelli-hc" },

  { cat:"fashion", client:"Zimmermann", title:"Spring 2024 — Natura",
    role:"Coordination", yt:"Gk42rzGz6Bk" },

  { cat:"fashion", client:"Nina Ricci", title:"Spring Summer 25",
    role:"Coordination", yt:"Sn-BA7DL8SE" },

  { cat:"fashion", client:"Vivienne Westwood", title:"Fall Winter 2024/2025",
    role:"Chargé de production", yt:"_qXXysTi3zY" },

  { cat:"fashion", client:"Rhude", title:"Out of Range",
    role:"Chargé de production", yt:"14JFB0EGOGA", loop:"rhude" },

  { cat:"fashion", client:"Comme des Garçons", title:"SHIRT Fall-Winter 2024",
    role:"Chargé de production", yt:"_ed8rrp7bTA" },

  { cat:"fashion", client:"3.Paradis", title:"Spring-Summer 2025",
    role:"Chargé de production", yt:"FVCvkUQQEy4" },

  { cat:"fashion", client:"Patou", title:"Hiver 24",
    role:"Chargé de production", yt:"hr3dziAOW4s", loop:"patou" },

  { cat:"fashion", client:"Georges Hobeika", title:"Couture Spring 2024",
    role:"Chargé de production", yt:"uoLh_T2Z3CE" },

  { cat:"fashion", client:"Junya Watanabe", title:"MAN Fall-Winter 2024",
    role:"Chargé de production", yt:"JVZ70TBUSm0" },

  { cat:"fashion", client:"Zuhair Murad", title:"Spring-Summer 2024 Couture",
    role:"Chargé de production", yt:"5dIrBx85W_o" },

  { cat:"fashion", client:"Bluemarble", title:"Starchaser",
    role:"Chargé de production", yt:"mcpv4vfdPgU" },

  { cat:"fashion", client:"Juun.J", title:"Eccentric",
    role:"Chargé de production", yt:"RCM9yqXUMEA" },

  { cat:"fashion", client:"Songzio", title:"Night Thieves",
    role:"Chargé de production", yt:"SsXeivpoMx0" },

  // Ajoutés le 01/09 — rôle « Coordination » déduit des dates, à confirmer.
  { cat:"fashion", client:"KENZO", title:"Spring-Summer 2026",
    role:"Coordination", yt:"MY5pvs_KgAU" },

  { cat:"fashion", client:"KENZO by NIGO", title:"Fall-Winter 2025",
    role:"Coordination", yt:"YBxgsqKSkUA" },

  { cat:"fashion", client:"Drôle de Monsieur", title:"Automne/Hiver 2025",
    role:"Coordination", yt:"o5b4zJQazwE" },

  { cat:"fashion", client:"032c", title:"Suspicious Minds",
    role:"Coordination", yt:"rCf4iEkTMHU" },

  // Ajoutés le 01/09 depuis les liens retrouvés sur l'ancien site Wix
  { cat:"fashion", client:"Comme des Garçons", title:"Fall/Winter 2025",
    role:"Coordination", yt:"YW0q4spnnj8", loop:"cdg-fw2025" },

  { cat:"fashion", client:"Zimmermann", title:"Spring 2025 — Illumination",
    role:"Coordination", yt:"LtnXxaWghtg" }
];
