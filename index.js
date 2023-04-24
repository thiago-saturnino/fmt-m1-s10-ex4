const express = require("express");
const connection = require("./src/database");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Place = require("./src/models/places");
const User = require("./src/models/users");

const validateToken = require("./src/middlewares/validateToken");

const app = express();

app.use(express.json());

connection.authenticate();
connection.sync({ alter: true });
console.log("API ON");

app.listen(3333, () => {
  console.log("SERVIDOR ON!");
});

app.post("/places", validateToken, async (req, res) => {
  try {
    const place = {
      name: req.body.name,

      numberPhone: req.body.numberPhone,

      openingHours: req.body.openingHours,

      description: req.body.description,

      latitude: req.body.latitude,

      longitude: req.body.longitude,
    };

    const newPlace = await Place.create(place);

    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/places", validateToken, async (req, res) => {
  try {
    const places = await Place.findAll();
    return res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Não há dados" });
  }
});

app.delete("/places/:id", validateToken, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Local não encontrado" });
    }
    await place.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/places/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      numberPhone,
      openingHours,
      description,
      latitude,
      longitude,
    } = req.body;

    const place = await Place.findByPk(id);

    place.name = name;
    place.numberPhone = numberPhone;
    place.openingHours = openingHours;
    place.description = description;
    place.latitude = latitude;
    place.longitude = longitude;

    const placeUpdated = await place.save();

    return res.json(placeUpdated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = {
      name: req.body.name,

      email: req.body.email,

      username: req.body.username,

      password: req.body.password,
    };

    const newUser = await User.create(user);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/sessions/:username/:password", async (req, res) => {
  try {
    const userExists = await User.findOne({
      where: { username: req.params.username },
    });

    if (!userExists) {
      return res.status(404).json({ message: "Credenciais Incorretas" });
    }

    const passwordExists = await User.findOne({
      where: { password: req.params.password },
    });
    /*     const passwordExists = await bcrypt.compare(req.params.password, userExists.password) */

    if (!passwordExists) {
      return res
        .status(400)
        .json({ message: "Confira suas informações de acesso" });
    }

    const token = jwt.sign(
      {
        id: userExists.id,
      },
      "MINHA_CHAVE_TOKEN",
      {
        expiresIn: "1m",
      }
    );
    res.json({ username: userExists.username, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Não foi possível processar a solicitação" });
  }
});
