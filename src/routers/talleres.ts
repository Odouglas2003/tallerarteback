import { Router } from "express";
import { prisma } from "../lib/prisma";
const r = Router();

r.get("/", async (_req, res) => {
  const data = await prisma.taller.findMany({
    include: { maestro: true, alumnos: { include: { alumno: true } } }
  });
  res.json(data);
});

r.post("/", async (req, res) => {
  // fecha_ini/fecha_fin deben venir como ISO: "2025-08-12T00:00:00.000Z" o "2025-08-12"
  const data = await prisma.taller.create({ data: req.body });
  res.status(201).json(data);
});

r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.taller.findUnique({
    where: { id_taller: id },
    include: { maestro: true, alumnos: { include: { alumno: true } }, comprobantes: true }
  });
  res.json(data);
});

r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.taller.update({ where: { id_taller: id }, data: req.body });
  res.json(data);
});

r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.taller.delete({ where: { id_taller: id } });
  res.status(204).end();
});

export default r;
