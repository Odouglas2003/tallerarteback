import { Router } from "express";
import { prisma } from "../lib/prisma";
const r = Router();

// Listar todos los alumnos
r.get("/", async (_req, res) => {
  const data = await prisma.alumno.findMany({
    include: {
      inscripciones: { include: { taller: true } },
      comprobantes: true
    }
  });
  res.json(data);
});

// Crear alumno
r.post("/", async (req, res) => {
  const data = await prisma.alumno.create({ data: req.body });
  res.status(201).json(data);
});

// Obtener un alumno por ID
r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.alumno.findUnique({
    where: { id_alumno: id },
    include: {
      inscripciones: { include: { taller: true } },
      comprobantes: true
    }
  });
  res.json(data);
});

// Actualizar alumno
r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.alumno.update({
    where: { id_alumno: id },
    data: req.body
  });
  res.json(data);
});

// Eliminar alumno
r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.alumno.delete({ where: { id_alumno: id } });
  res.status(204).end();
});

// Inscribir alumno en un taller
r.post("/:id/inscribir", async (req, res) => {
  const id_alumno = Number(req.params.id);
  const { id_taller } = req.body;
  const data = await prisma.alumno_taller.create({
    data: { id_alumno, id_taller }
  });
  res.status(201).json(data);
});

export default r;
