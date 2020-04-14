const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  
  const results = title
    ? repositories.filter(repositorie => repositorie.title.includes(title))
    : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repositorie = {
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0,
  };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => 
    repositorie.id === id
  );

  if (repositorieIndex === -1) {
    return response.status(400).json({ error: "Repository does't exists."});
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => 
    repositorie.id === id
    );

    if (repositorieIndex >= 0) {
      repositories.splice(repositorieIndex, 1);
    } else {
      return response.status(400).json({ error: "Repository does't exists."});
    }

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id} = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => 
    repositorie.id === id
  );

  if (repositorieIndex === -1) {
    return response.status(400).json({ error: "Repository does't exists."});
  }

  repositories[repositorieIndex].likes += 1;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;
