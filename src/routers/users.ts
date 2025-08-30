import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

const r = Router();

// qué campos mostrar (no exponemos password_hash)
const SELECT_PUBLIC = {
  id_user: true,
  username: true,
  nombre: true,
  apellido: true,
  rol: true,
  alumno_id: true,
  maestro_id: true
};

// Crear usuario
r.post("/", async (req, res) => {
  try {
    const { username, nombre, apellido, password, rol, alumno_id, maestro_id } = req.body;

    if (!username || !password || !nombre || !apellido) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.usuarios.create({
      data: { username, nombre, apellido, password_hash, rol, alumno_id, maestro_id },
      select: SELECT_PUBLIC
    });

    res.status(201).json(user);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "El username ya existe" });
    }
    console.error("POST /users error", err);
    res.status(500).json({ error: "Error creando usuario" });
  }
});

// Login
r.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username y password son obligatorios" });
  }

  const user = await prisma.usuarios.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({
    id_user: user.id_user,
    username: user.username,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
    alumno_id: user.alumno_id,
    maestro_id: user.maestro_id
  });
});

// Listar todos
r.get("/", async (_req, res) => {
  const users = await prisma.usuarios.findMany({ select: SELECT_PUBLIC });
  res.json(users);
});

// Obtener uno
r.get("/:id", async (req, res) => {
  const id_user = Number(req.params.id);
  const user = await prisma.usuarios.findUnique({ where: { id_user }, select: SELECT_PUBLIC });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// Actualizar datos (excepto password)
r.put("/:id", async (req, res) => {
  try {
    const id_user = Number(req.params.id);
    const { nombre, apellido, rol, alumno_id, maestro_id, username } = req.body;

    const user = await prisma.usuarios.update({
      where: { id_user },
      data: { nombre, apellido, rol, alumno_id, maestro_id, username },
      select: SELECT_PUBLIC
    });

    res.json(user);
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "El username ya existe" });
    }
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error("PUT /users/:id error", err);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
});

// Cambiar contraseña
r.put("/:id/password", async (req, res) => {
  const id_user = Number(req.params.id);
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "password es obligatorio" });

  const password_hash = await bcrypt.hash(password, 10);
  try {
    await prisma.usuarios.update({
      where: { id_user },
      data: { password_hash }
    });
    res.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error("PUT /users/:id/password error", err);
    res.status(500).json({ error: "Error cambiando contraseña" });
  }
});

// Eliminar usuario
r.delete("/:id", async (req, res) => {
  const id_user = Number(req.params.id);
  try {
    await prisma.usuarios.delete({ where: { id_user } });
    res.status(204).end();
  } catch (err: any) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.error("DELETE /users/:id error", err);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
});

// Enlazar a alumno
r.post("/:id/link-alumno", async (req, res) => {
  const id_user = Number(req.params.id);
  const { alumno_id } = req.body || {};
  if (!alumno_id) return res.status(400).json({ error: "alumno_id es obligatorio" });

  const user = await prisma.usuarios.update({
    where: { id_user },
    data: { alumno_id, maestro_id: null },
    select: SELECT_PUBLIC
  });
  res.json(user);
});

// Enlazar a maestro
r.post("/:id/link-maestro", async (req, res) => {
  const id_user = Number(req.params.id);
  const { maestro_id } = req.body || {};
  if (!maestro_id) return res.status(400).json({ error: "maestro_id es obligatorio" });

  const user = await prisma.usuarios.update({
    where: { id_user },
    data: { maestro_id, alumno_id: null },
    select: SELECT_PUBLIC
  });
  res.json(user);
});

// Quitar vínculos
r.post("/:id/unlink", async (req, res) => {
  const id_user = Number(req.params.id);
  const user = await prisma.usuarios.update({
    where: { id_user },
    data: { alumno_id: null, maestro_id: null },
    select: SELECT_PUBLIC
  });
  res.json(user);
});

export default r;
