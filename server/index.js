const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

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
app.get("/materiel", (req, res) => {
  db.query("SELECT * FROM materiel ORDER BY code_fam DESC", (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/familles", (req, res) => {
  db.query("SELECT * FROM famille ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/fournisseurs", (req, res) => {
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
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
  });
});

app.get("/affectations", (req, res) => {
  db.query(
    `SELECT a.*, m.libelle 
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

app.post("/materiel_affectation", (req, res) => {
  const { structure, date } = req.body;

  // Vérification des champs requis
  if (!date || !structure) {
    return res
      .status(400)
      .json({ error: "Champs 'date' et 'structure' requis." });
  }

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
  `;

  db.query(query, [structure, date, date], (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      return res.status(500).json({ error: "Erreur dans la base de données." });
    }

    res.status(200).json(results);
  });
});

app.post("/api/materiels", (req, res) => {
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
app.post("/api/familles", (req, res) => {
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
app.post("/api/fournisseurs", (req, res) => {
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

app.post("/materiel_affectationglobale", (req, res) => {
  const { structure, date } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Le champ 'date' est requis." });
  }

  // Préparation de la requête SQL de base
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
      AND NOT EXISTS (
        SELECT 1
        FROM reintegration r
        WHERE r.code_mat = a.code_mat
          AND r.date <= ?
      )
  `;

  const params = [date, date];

  // Si une structure est précisée, on ajoute la clause
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

app.post("/transfert", (req, res) => {
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

app.post("/reintegration", (req, res) => {
  const { date, structure, structureto, codes_mat } = req.body;

  if (!date || !structure || !structureto || !Array.isArray(codes_mat)) {
    return res.status(400).json({ error: "Données invalides" });
  }

  const type_affectation = "REINTEGRATION";
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
      console.error("❌ Erreur lors de reintegration :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    console.log(`✅ Reintegration effectué pour ${codes_mat.length} matériels`);
    return res.status(200).json({
      message: "Reintegration effectué avec succès",
      insertCount: result.affectedRows,
    });
  });
});
// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
