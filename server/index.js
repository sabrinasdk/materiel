const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// ✅ Configuration CORS correcte
app.use(
  cors({
    origin: "http://localhost:5173", // autorise les requêtes venant de Vite
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Connexion MySQL
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
  db.query("SELECT * FROM materiel ORDER BY code_mat DESC", (err, results) => {
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

app.get("/structures", (req, res) => {
  db.query("SELECT * FROM structure ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Erreur de requête :", err);
      res.status(500).json({ error: "Erreur dans la base de données" });
    } else {
      res.json(results);
    }
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

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
