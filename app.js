import mongoose from "mongoose";
import express from "express";
import cors from "cors";
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Existed");
    console.log("Connexion reussie a la base de donnees");
  } catch (err) {
    console.log(err);
  }
};
connectDB();

// importation des pays
const importatation_pays = async () => {
  try {
    const data = await fetch(
      "https://w3.unece.org/PXWeb2015/api/v1/en/STAT/10-CountryOverviews/01-Figures/ZZZ_en_CoSummary_r.px"
    ).then((res) => res.json());
    const pays = await data["variables"][1].valueTexts;
  } catch (err) {
    console.log(err);
  }
};
importatation_pays();

// importation de donnee api vers mongo db
const commentaires = async () => {
  try {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/comments?userId=1"
    ).then((res) => res.json());
    await mongoose.connection.db.collection("commentaires").insertMany(data);
    console.log("Donnees importées avec succès");
  } catch (err) {
    console.log(err);
  }
};
commentaires();

// importation des utilisateurs
const importation_users = async () => {
  let pays = [];
  try {
    const data = await fetch(
      "https://w3.unece.org/PXWeb2015/api/v1/en/STAT/10-CountryOverviews/01-Figures/ZZZ_en_CoSummary_r.px"
    ).then((res) => res.json());
    pays = await data["variables"][1].valueTexts;
  } catch (err) {
    console.log(err);
  }

  try {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/users?userId=1"
    ).then((res) => res.json());
    const users = await data.map((item) => {
      return {
        ...item,
        address: {
          street: item["address"]["street"],
          country: pays[Math.floor(Math.random() * pays.length)],
        },
      };
    });
    console.log([Math.floor(Math.random() * pays.length)]);
    await mongoose.connection.db.collection("users").insertMany(users);
    console.log("importation utilisateur reussie");
  } catch (err) {
    console.log(err);
  }
};
importation_users();

const app = express();
const port = 3000;

app.use(cors());

// route pour recuperer les commentaires
app.get("/commentaires", async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection("commentaires").find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection("users").find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Application demmarre sur le port  ${port}`);
});
