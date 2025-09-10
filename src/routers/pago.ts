import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Listar pagos (opcional filtro por alumno)
r.get("/", async (req, res) => {
  const id_alumno = req.query.alumno ? Number(req.query.alumno) : undefined;
  const where = id_alumno ? { id_alumno } : {};
  const pagos = await prisma.pago.findMany({
    where,
    orderBy: { fecha: "desc" },
    include: { alumno: true }
  });
  res.json(pagos);
});

// Crear pago
r.post("/", async (req, res) => {
  const { nombre, importe, tipo, archivo, id_alumno, fecha } = req.body;
  if (!nombre || !importe || !tipo || !id_alumno) {
    return res.status(400).json({ error: "nombre, importe, tipo, id_alumno son obligatorios" });
  }
  const data = await prisma.pago.create({
    data: { nombre, importe, tipo, archivo, id_alumno, fecha }
  });
  res.status(201).json(data);
});

// Obtener pago
r.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const pago = await prisma.pago.findUnique({ where: { id_pago: id } });
  if (!pago) return res.status(404).json({ error: "Pago no encontrado" });
  res.json(pago);
});

// Actualizar pago
r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.pago.update({ where: { id_pago: id }, data: req.body });
  res.json(data);
});

// Eliminar pago
r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.pago.delete({ where: { id_pago: id } });
  res.status(204).end();
});

export default r;
