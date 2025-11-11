const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const jwt = require("jsonwebtoken");
const SECRET_KEY = "votre_secret_super_secure";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    req.user = decoded; // tu peux accéder à req.user.id dans tes routes
    next();
  });
}

app.use(
  cors({
    origin: "http://localhost:5174", // autorise les requêtes venant de Vite
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "parc_info_dep",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("✅ Connecté à MySQL");
});

// Route GET
app.get("/materiel", verifyToken, (req, res) => {
  db.query("SELECT * FROM materiel ORDER BY code_fam DESC", (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/familles", verifyToken, (req, res) => {
  db.query("SELECT * FROM famille ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

// ✅ Route d'affectation de matériel (sans .promise)
app.post("/affectation_materiel", verifyToken, (req, res) => {
  const { structure, date, utilisateur, nombre } = req.body;
  const dinfCode = "DINF";

  if (!structure || !date) {
    return res
      .status(400)
      .json({ error: "Champs 'structure' et 'date' requis." });
  }

  const insertQuery = `
    INSERT INTO affectation (code_str, code_mat, beneficiaire, date, type_affectation, user_add)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  let count = 0;
  let total = nombre;
  let hasError = false;

  for (let i = 1; i <= nombre; i++) {
    const code_mat = req.body[`materiel_${i}`];
    const type_affect = req.body[`affectation_definitive_${i}`];
    const remplacement = req.body[`affectation_temporaire_${i}`];

    console.log("➡️ Données reçues :", { code_mat, type_affect, remplacement });

    if (!code_mat) {
      total--;
      continue;
    }

    // ✅ 1) Affectation principale
    db.query(
      insertQuery,
      [structure, code_mat, utilisateur, date, type_affect, req.user.nom],
      (err) => {
        if (err) {
          console.error("💥 Erreur insertion principale :", err);
          if (!hasError) {
            hasError = true;
            return res
              .status(500)
              .json({ error: "Erreur SQL : " + err.message });
          }
          return;
        }

        console.log(`✅ ${code_mat} affecté à ${structure}`);

        // 🔁 2) Si remplacement → transfert de l'ancien vers DINF
        if (type_affect === "A la place de" && remplacement) {
          db.query(
            insertQuery,
            [
              dinfCode,
              remplacement,
              utilisateur,
              date,
              "Transfert vers DINF",
              req.user.nom,
            ],
            (err2) => {
              if (err2) {
                console.error("💥 Erreur transfert DINF :", err2);
                if (!hasError) {
                  hasError = true;
                  return res
                    .status(500)
                    .json({ error: "Erreur SQL DINF : " + err2.message });
                }
                return;
              }
              console.log(`🔁 ${remplacement} transféré vers ${dinfCode}`);

              count++;
              if (count === total && !hasError) {
                res.json({
                  success: true,
                  message:
                    "Toutes les affectations ont été enregistrées avec succès.",
                });
              }
            }
          );
        } else {
          count++;
          if (count === total && !hasError) {
            res.json({
              success: true,
              message:
                "Toutes les affectations ont été enregistrées avec succès.",
            });
          }
        }
      }
    );
  }
});

app.get("/fournisseurs", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM fournisseur ORDER BY code_frs DESC",
    (err, results) => {
      if (err) {
        console.error("Erreur de requête :", err);
        res.status(500).json({ error: "Erreur dans la base de données **" });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/structures", (req, res) => {
  db.query("SELECT * FROM structure ORDER BY code_str ASC", (err, results) => {
    if (err) {
      console.error("Erreur SQL /structures :", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/utilisateurs", verifyToken, (req, res) => {
  db.query("SELECT * FROM utilisateur Order By nom ASC", (err, results) => {
    if (err) {
      console.error("Erreur de requete : get utilisateurs ", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/affectations", verifyToken, (req, res) => {
  db.query(
    `SELECT DISTINCT a.*, m.libelle 
     FROM affectation a
     JOIN materiel m ON a.code_mat = m.matricule
     ORDER BY a.code_str ASC`,
    (err, results) => {
      if (err) {
        console.error("Erreur de requête :", err);
        res.status(500).json({ error: "Erreur dans la base de données" });
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { nom, motdepasse } = req.body;

  const sql = "SELECT * FROM profil WHERE nom = ?";
  db.query(sql, [nom], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Nom utilisateur incorrect" });
    }

    const user = result[0];

    if (motdepasse !== user.motdepasse) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // ✅ Création du token JWT
    const token = jwt.sign(
      { id: user.id, nom: user.nom },
      SECRET_KEY,
      { expiresIn: "2h" } // durée de validité du token
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, nom: user.nom },
    });
  });
});

app.post("/materiel_affectation", verifyToken, (req, res) => {
  const { structure, date } = req.body;

  // Vérification des champs requis
  if (!date || !structure) {
    return res
      .status(400)
      .json({ error: "Champs 'date' et 'structure' requis." });
  }
  /*
  const query = `
    SELECT 
        a.*, 
        m.libelle, 
        m.montant
    FROM affectation a
    INNER JOIN (
        SELECT code_mat, MAX(date) AS max_date
        FROM affectation
        GROUP BY code_mat
    ) last_aff
        ON a.code_mat = last_aff.code_mat
       AND a.date = last_aff.max_date
    INNER JOIN materiel m
        ON a.code_mat = m.matricule
    WHERE a.code_str = ?
      AND a.date <= ?
      AND NOT EXISTS (
        SELECT 1
        FROM reintegration r
        WHERE r.code_mat = a.code_mat
          AND r.date <= ?
      );
  `;*/

  const query = `
  SELECT 
      a.*, 
      m.libelle, 
      m.montant
  FROM affectation a
  INNER JOIN (
      SELECT code_mat, MAX(date) AS max_date
      FROM affectation
      GROUP BY code_mat
  ) last_aff
      ON a.code_mat = last_aff.code_mat
     AND a.date = last_aff.max_date
  INNER JOIN materiel m
      ON a.code_mat = m.matricule
  WHERE a.code_str = ?
    AND a.date <= ?
    AND (
      NOT EXISTS (
        SELECT 1
        FROM reintegration r
        WHERE r.code_mat = a.code_mat
          AND r.date <= ?
      )
      OR a.date > (
        SELECT MAX(r.date)
        FROM reintegration r
        WHERE r.code_mat = a.code_mat
      )
    );
`;

  db.query(query, [structure, date, date], (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      return res.status(500).json({ error: "Erreur dans la base de données." });
    }

    res.status(200).json(results);
  });
});

app.post("/api/materiels", verifyToken, (req, res) => {
  const {
    famille,
    date_acquisition,
    designation,
    fournisseur,
    garantie,
    date_fin_garantie,
    montant,
    numero_sequentiel,
    nombre,
  } = req.body;

  const inserts = [];
  let seq = parseInt(numero_sequentiel, 10);

  for (let i = 0; i < nombre; i++) {
    const matricule = `${famille}/${seq + i}`;
    inserts.push([
      famille,
      date_acquisition,
      designation,
      fournisseur,
      garantie,
      date_fin_garantie,
      montant,
      matricule,
      1,
    ]);
  }

  const sql = `
    INSERT INTO materiel (
      code_fam,
      date_acquisition,
      libelle,
      code_frs,
      garantie,
      date_fin_garantie,
      montant,
      matricule,
      disponible
    ) VALUES ?
  `;

  db.query(sql, [inserts], (err, result) => {
    if (err) {
      console.error("❌ Erreur d'insertion :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de l'insertion dans la base" });
    } else {
      console.log(`✅ ${nombre} matériels insérés avec succès`);
      res.status(201).json({
        message: `${nombre} matériels insérés avec succès`,
        insertCount: result.affectedRows,
      });
    }
  });
});

// Route POST pour insérer une famille
app.post("/api/familles", verifyToken, (req, res) => {
  const { code_fam, libelle } = req.body;

  const sql = "INSERT INTO famille (code_fam, libelle) VALUES (?, ?)";
  db.query(sql, [code_fam, libelle], (err, result) => {
    if (err) {
      console.error("Erreur lors de l’insertion :", err);
      return res.status(500).send("Erreur serveur");
    }
    res
      .status(200)
      .send({ message: "Famille ajoutée avec succès", id: result.insertId });
  });
});

// Route POST pour insérer une famille
app.post("/api/fournisseurs", verifyToken, (req, res) => {
  const { code_frs, libelle, telephone, adresse, email } = req.body;

  const sql =
    "INSERT INTO fournisseur (code_frs, libelle, telephone, adresse, email) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [code_frs, libelle, telephone, adresse, email],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l’insertion :", err);
        return res.status(500).send("Erreur serveur");
      }
      res.status(200).send({
        message: "Fournisseur ajouté avec succès",
        id: result.insertId,
      });
    }
  );
});

app.post("/materiel_affectationglobale", verifyToken, (req, res) => {
  const { structure, date } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Le champ 'date' est requis." });
  }

  let query = `
    SELECT 
        a.*, 
        m.libelle, 
        m.montant
    FROM affectation a
    INNER JOIN (
        SELECT code_mat, MAX(date) AS max_date
        FROM affectation
        GROUP BY code_mat
    ) last_aff
        ON a.code_mat = last_aff.code_mat
       AND a.date = last_aff.max_date
    INNER JOIN materiel m
        ON a.code_mat = m.matricule
    WHERE a.date <= ?
      AND (
          -- Cas 1 : le matériel n’a jamais été réintégré
          NOT EXISTS (
              SELECT 1 FROM reintegration r
              WHERE r.code_mat = a.code_mat
                AND r.date <= ?
          )
          -- Cas 2 : il a été réintégré mais ensuite réaffecté après la dernière réintégration
          OR a.date > (
              SELECT IFNULL(MAX(r.date), '0000-00-00')
              FROM reintegration r
              WHERE r.code_mat = a.code_mat
          )
      )
  `;

  const params = [date, date];

  if (structure && structure !== "all") {
    query += " AND a.code_str = ?";
    params.push(structure);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      return res.status(500).json({ error: "Erreur dans la base de données." });
    }

    res.status(200).json(results);
  });
});

app.post("/transfert", verifyToken, (req, res) => {
  const { date, structure, structureto, codes_mat } = req.body;

  if (!date || !structure || !structureto || !Array.isArray(codes_mat)) {
    return res.status(400).json({ error: "Données invalides" });
  }

  const type_affectation = "TRANSFERT";
  const nbr = 1;

  const inserts = codes_mat.map((code_mat) => [
    date,
    code_mat,
    structureto,
    type_affectation,
    nbr,
  ]);

  const sql = `
    INSERT INTO affectation (
      date,
      code_mat,
      code_str,
      type_affectation,
      nbr
    ) VALUES ?
  `;

  db.query(sql, [inserts], (err, result) => {
    if (err) {
      console.error("❌ Erreur lors du transfert :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    console.log(`✅ Transfert effectué pour ${codes_mat.length} matériels`);
    return res.status(200).json({
      message: "Transfert effectué avec succès",
      insertCount: result.affectedRows,
    });
  });
});

app.post("/reintegration", verifyToken, (req, res) => {
  const { date, structure, structureto, codes_mat, motif } = req.body;

  // Vérification des champs
  if (!date || !structure || !structureto || !Array.isArray(codes_mat)) {
    return res.status(400).json({ error: "Données invalides" });
  }

  const type_affectation = "REINTEGRATION";
  const nbr = 1;

  // Données pour la table affectation
  const affectationInserts = codes_mat.map((code_mat) => [
    date,
    code_mat,
    structureto,
    type_affectation,
    nbr,
  ]);

  // Données pour la table reintegration
  const reintegrationInserts = codes_mat.map((code_mat) => [
    date,
    code_mat,
    structure,
    motif || null, // si le motif n’est pas fourni
  ]);

  // Insertion dans affectation puis reintegration
  const sqlAffectation = `
    INSERT INTO affectation (
      date,
      code_mat,
      code_str,
      type_affectation,
      nbr
    ) VALUES ?
  `;

  const sqlReintegration = `
    INSERT INTO reintegration (
      date,
      code_mat,
      code_str,
      motif
    ) VALUES ?
  `;

  // Commence une transaction pour que les deux insertions soient cohérentes
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur transaction :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    // 1️⃣ Insertion dans affectation
    db.query(sqlAffectation, [affectationInserts], (err, result1) => {
      if (err) {
        return db.rollback(() => {
          console.error("Erreur insertion affectation :", err);
          res
            .status(500)
            .json({ error: "Erreur lors de l’insertion dans affectation" });
        });
      }

      // 2️⃣ Insertion dans reintegration
      db.query(sqlReintegration, [reintegrationInserts], (err, result2) => {
        if (err) {
          return db.rollback(() => {
            console.error("Erreur insertion reintegration :", err);
            res
              .status(500)
              .json({ error: "Erreur lors de l’insertion dans reintegration" });
          });
        }

        // ✅ Si tout est bon, on valide la transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Erreur commit :", err);
              res.status(500).json({ error: "Erreur lors de la validation" });
            });
          }

          console.log(
            `✅ Réintégration effectuée pour ${codes_mat.length} matériels`
          );
          res.status(200).json({
            message: "Réintégration effectuée avec succès",
            affectationCount: result1.affectedRows,
            reintegrationCount: result2.affectedRows,
          });
        });
      });
    });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
