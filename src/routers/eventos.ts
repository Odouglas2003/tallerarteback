import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Listar eventos (ordenados por fecha_inicio)
r.get("/", async (_req, res) => {
  const eventos = await prisma.event.findMany({
    orderBy: { fecha_inicio: "asc" }
  });
  res.json(eventos);
});

// Crear evento
r.post("/", async (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin, emoji } = req.body;
  if (!titulo || !fecha_inicio || !fecha_fin || !emoji) {
    return res.status(400).json({ error: "titulo, fecha_inicio, fecha_fin, emoji son obligatorios" });
  }
  const ev = await prisma.event.create({
    data: { titulo, descripcion, fecha_inicio, fecha_fin, emoji }
  });
  res.status(201).json(ev);
});

// Obtener evento
r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const ev = await prisma.event.findUnique({ where: { id_evento: id } });
  if (!ev) return res.status(404).json({ error: "Evento no encontrado" });
  res.json(ev);
});

// Actualizar evento
r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const ev = await prisma.event.update({ where: { id_evento: id }, data: req.body });
  res.json(ev);
});

// Eliminar evento
r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.event.delete({ where: { id_evento: id } });
  res.status(204).end();
});

export default r;
