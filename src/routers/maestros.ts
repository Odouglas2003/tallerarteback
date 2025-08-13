import { Router } from "express";
import { prisma } from "../lib/prisma";
const r = Router();

r.get("/", async (_req, res) => {
  const data = await prisma.maestro.findMany({ include: { talleres: true } });
  res.json(data);
});

r.post("/", async (req, res) => {
  const data = await prisma.maestro.create({ data: req.body });
  res.status(201).json(data);
});

r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.maestro.findUnique({
    where: { id_maestro: id },
    include: { talleres: true }
  });
  res.json(data);
});

r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.maestro.update({
    where: { id_maestro: id },
    data: req.body
  });
  res.json(data);
});

r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.maestro.delete({ where: { id_maestro: id } });
  res.status(204).end();
});

export default r;
