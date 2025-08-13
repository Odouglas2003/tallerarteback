import { Router } from "express";
import { prisma } from "../lib/prisma";
const r = Router();

r.get("/", async (req, res) => {
  const { alumno, taller } = req.query;
  const data = await prisma.comprobante.findMany({
    where: {
      ...(alumno ? { id_alumno: Number(alumno) } : {}),
      ...(taller ? { id_taller: Number(taller) } : {})
    },
    orderBy: { fecha_pago: "desc" }
  });
  res.json(data);
});

r.post("/", async (req, res) => {
  // body: { id_alumno, id_taller?, fecha_pago, monto, estado? }
  const data = await prisma.comprobante.create({ data: req.body });
  res.status(201).json(data);
});

r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.comprobante.update({
    where: { id_comprobante: id },
    data: req.body
  });
  res.json(data);
});

r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.comprobante.delete({ where: { id_comprobante: id } });
  res.status(204).end();
});

export default r;
