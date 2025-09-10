import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import alumnos from "./routers/alumnos";
import maestros from "./routers/maestros";
import talleres from "./routers/talleres";
import pagos from "./routers/pagos";
import eventos from "./routers/eventos";



const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API TallerArte OK"));

app.use("/alumnos", alumnos);   // ya lo tenías
app.use("/maestros", maestros);
app.use("/talleres", talleres);
app.use("/pagos", pagos);
app.use("/pagos", pagos);
app.use("/eventos", eventos);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`Escuchando en http://localhost:${port}`));
