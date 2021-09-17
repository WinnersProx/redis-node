import axios from "axios";
import express from "express";
import redis from "redis";

const PORT = 3000;

const app = express();

const redisClient = redis.createClient(); // can use { url } for production environment

const todosApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/todos",
});

const router = express.Router();

const REDIS_TTL = 3600;

router.get("/photos", async (req, res) => {
  await getTodos(albumId, (data) => {
    return res.json(data);
  });
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

/** TODO: Add a logic to get or set data given a key and callback to set data */
const getTodos = async (callback) => {
  return redisClient.get("todos", async (error, photos) => {
    if (error) console.error("Some went wrong", error);

    if (!!photos) return callback(JSON.parse(photos));

    const { data } = await todosApi.get("/", { params: { albumId } });

    redisClient.setex("todos", REDIS_TTL, JSON.stringify(data));

    return callback(data);
  });
};
