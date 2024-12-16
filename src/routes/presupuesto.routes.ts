import { type PrismaClient } from "@prisma/client";
import { Router } from "express";

const PresupuestoRoute = (prisma: PrismaClient) => {
  const router = Router();

  router.post("/", async (req, res) => {
    const { descripcion, montoTotal, cant_cuotas, fecha_objetivo, user_id } =
      req.body;

    try {
      const presupuesto = await prisma.presupuesto.create({
        data: {
          descripcion,
          montoTotal,
          cant_cuotas,
          fecha_objetivo: new Date(fecha_objetivo),
          total_acumulado: 0, // Inicialmente 0
          user_id,
        },
      });

      const categoria = await prisma.categoryGasto.create({
        data: {
          name: descripcion,
          description: `Categoría asociada al presupuesto ${descripcion}`,
        },
      });

      res.status(201).json({ presupuesto, categoria });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error al crear el presupuesto y la categoría." });
    }
  });

  // Actualizar el total acumulado de un presupuesto
  router.put("/actualizar/:presupuesto_id", async (req, res) => {
    const { presupuesto_id } = req.params;
    const { gasto } = req.body;

    try {
      const presupuesto = await prisma.presupuesto.findUnique({
        where: { id: Number(presupuesto_id) },
      });

      if (!presupuesto) {
        res.status(404).send({ message: "Presupuesto no encontrado." });
        return;
      }

      const nuevoTotalAcumulado = presupuesto.total_acumulado + gasto;

      if (nuevoTotalAcumulado > presupuesto.montoTotal) {
        res.status(400).send({
          message: "El gasto excede el monto total del presupuesto.",
          limite: presupuesto.montoTotal - presupuesto.total_acumulado,
        });
        return;
      }

      const presupuestoActualizado = await prisma.presupuesto.update({
        where: { id: Number(presupuesto_id) },
        data: { total_acumulado: nuevoTotalAcumulado },
      });

      res.json(presupuestoActualizado);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al actualizar el presupuesto." });
    }
  });

  // Eliminar un presupuesto
  router.delete("/:presupuesto_id", async (req, res) => {
    const { presupuesto_id } = req.params;

    try {
      await prisma.presupuesto.delete({
        where: { id: Number(presupuesto_id) },
      });

      res.status(200).send({ message: "Presupuesto eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al eliminar el presupuesto." });
    }
  });

  // Obtener todos los presupuestos vinculados a un usuario
  router.get("/user/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
      const presupuestos = await prisma.presupuesto.findMany({
        where: { user_id: Number(user_id) },
      });

      if (presupuestos.length === 0) {
        res.status(404).send({
          message: "No se encontraron presupuestos para este usuario.",
        });
        return;
      }

      res.json(presupuestos);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al obtener los presupuestos." });
    }
  });

  return router;
};

export default PresupuestoRoute;