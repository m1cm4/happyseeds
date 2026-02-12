**draft de la table seeding_patch** :

represente une reference d'un semis,

- `seed_id` : le paquet de graine utilisé depuis sa grainotheque
- `quantity` : le nombre approximatif de graines semées
- `started` : le jour du semis
- `status` : l'état du semis [demarré | premiere-pousse | pret-a-repiquer | pret-à-planter | planté-sur-le-terrain]
- `remarque` : notes, commentaires pendant le processus sur l'évolution, les difficultés, les surprises, les conclusions
- `timeline_id`: à quelle calendrier ce semis fait partie (ex "printemps 2026")
- `date_end_estim` : la date "quand la pousse sera prẑte à être plantée sur le terrain", estimée automatiquement par l'application grace aux informations sur la plante et la graine et les remaques récoltées par l'utilisateur enregistrées dan plant, seed, seeding_patch.
- `date_end_real`: "à quelle date l'utilisateur a planté les pousses sur son terrain ?" = la date réelle entrée manuellemnt par l'utilsateur où il a planté ses pousses en pleine terre.

```sql
CREATE TABLE IF NOT EXISTS "seeding_patch" (
	"seeding_patch_id" serial NOT NULL UNIQUE,
	"seed_id" bigint NOT NULL,
	"timeline_id" bigint NOT NULL,
	"quantity" bigint,
	"started" timestamp without time zone,
	"status" varchar(255),
	"date_end_estim" timestamp without time zone,
	"date_end_real" timestamp without time zone,
	"remarque" varchar(255),
	PRIMARY KEY ("seeding_patch_id")
);
```

---

**_draft de la table timeline_** :
l'entité calendrier permet de rassembler les entités semis `seeding_patch`.
l'utilisateur lui donnera un nom comme "printemps 2026 en intérieur", "Printemps 2026 en exterieur"

CREATE TABLE IF NOT EXISTS "timeline" (
"timeline_id" bigint NOT NULL,
"user_id" bigint NOT NULL,
"name" varchar(255),
"last_updated" timestamp without time zone,
"created" timestamp without time zone,
"description" varchar(255),
PRIMARY KEY ("timeline_id")
);
