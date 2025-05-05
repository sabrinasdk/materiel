const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(cors());
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
  console.log("Connecté à MySQL");
});

// Exemple de route GET
app.get("/materiel", (req, res) => {
  db.query("SELECT * FROM materiel ", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erreur dans la base de données" }, err);
    } else {
      res.json(results);
    }
  });
});

// Exemple de route POST/
/*
app.post("/api/materiels", (req, res) => {
  const { nom, email } = req.body;
  db.query(
    "INSERT INTO utilisateurs (nom, email) VALUES (?, ?)",
    [nom, email],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Erreur lors de l'insertion" });
      } else {
        res.status(201).json({ id: result.insertId, nom, email });
      }
    }
  );
});*/

app.post("/api/materiels", (req, res) => {
  const {
    famille,
    date_acquisition,
    designation,
    fournisseur,
    date_livraison,
    garantie,
    date_fin_garantie,
    montant,
    numero_sequentiel,
  } = req.body;

  const matricule = `${famille}/${numero_sequentiel}`;

  const sql = `
    INSERT INTO materiel (
      code_fam,
      date_acquisition,
      libelle,
      code_frs,
      date_acquisition,
      garantie,
      date_fin_garantie,
      montant,
      matricule
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    famille,
    date_acquisition,
    designation,
    fournisseur,
    date_livraison,
    garantie,
    date_fin_garantie,
    montant,
    matricule,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erreur d'insertion :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de l'insertion dans la base" });
    } else {
      res
        .status(201)
        .json({ message: "Matériel inséré avec succès", id: result.insertId });
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
