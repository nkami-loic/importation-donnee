import mongoose from "mongoose";
import { fa, faker } from "@faker-js/faker";
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/Learnsphere?directConnection=true",
      {
        connectTimeoutMS: 120000,
      }
    );
    console.log("Connexion reussie a la base de donnees");
  } catch (err) {
    console.log(err);
  }
};
connectDB();

// chargement des utilisateurs (avec faker) dans la base de donnee
const loadData = async () => {
  const categoriesCourses = ["devops", "dev", "web", "mobile", "cloud"];
  function createRandomUser() {
    return {
      _id: new mongoose.Types.ObjectId(),
      nom: faker.internet.username(),
      prenom: faker.internet.username(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElements(
        ["formateur", "etudiant", "admin"],
        faker.number.int({ min: 1, max: 3 })
      ),
      date_creation: faker.date.past(),
    };
  }

  const users = faker.helpers.multiple(createRandomUser, {
    count: 1000,
  });
  try {
    await mongoose.connection.collection("users").insertMany(users);
    console.log("Utilisateurs insérés avec succès");
  } catch (err) {
    console.log(err);
  }
  function createRandomCourse() {
    return {
      _id: new mongoose.Types.ObjectId(),
      titre: faker.commerce.productName(),
      prix: faker.commerce.price(),
      categorie:
        categoriesCourses[Math.floor(Math.random() * categoriesCourses.length)],
      module: {
        titre: faker.commerce.productName(),
        etapes: {
          titre: faker.commerce.productName(),
          duree: faker.number.int({ min: 10, max: 120 }),
        },
      },
      avis: {
        notes: faker.number.int({ min: 1, max: 5 }),
        commentaires: faker.lorem.sentence(),
      },
      formateur: faker.helpers.arrayElement(
        users.filter((user) => user.role.includes("formateur"))
      )._id,
      date_creation: faker.date.past(),
    };
  }
  const courses = faker.helpers.multiple(createRandomCourse, {
    count: 1000,
  });
  try {
    await mongoose.connection.collection("courses").insertMany(courses);
    console.log("Cours insérés avec succès");
  } catch (err) {
    console.log(err);
  }

  function createRandomEnrollment() {
    return {
      _id: null,
      user: faker.helpers.arrayElement(users)._id,
      course: faker.helpers.arrayElement(courses)._id,
      date_inscription: faker.date.past(),
    };
  }
  const enrollments = faker.helpers.multiple(createRandomEnrollment, {
    count: 1000,
  });
  try {
    await mongoose.connection.collection("enrollments").insertMany(enrollments);
    console.log("Enrollments insérés avec succès");
  } catch (err) {
    console.log(err);
  }
};
loadData();
