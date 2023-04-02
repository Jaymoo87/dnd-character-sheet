import * as express from "express";
import apiRouter from "./routes";
import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, "./data/state.json");

const app = express();

app.use(express.static("public"));
app.use(apiRouter);

//get state
app.get("/state", async (req, res, next) => {
  try {
    const results = await readState();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

app.patch("/state", async (req, res, next) => {
  try {
    const newState = { ...req.body };
    const results = await updateState(newState);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));

function readState() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, (error, results: any) => {
      if (error) {
        return reject(error);
      }
      const state = JSON.parse(results);
      return resolve(state);
    });
  });
}

function updateState(newState) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dataPath, JSON.stringify(newState, null, 2), (error) => {
      if (error) {
        return reject(error);
      }
      return resolve("state saved");
    });
  });
}
