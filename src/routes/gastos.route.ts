import { Prisma, type PrismaClient } from "@prisma/client";
import { Router } from "express";

const GastosRoute = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/historial/:user_id/:fecha_desde/:fecha_hasta", async (req, res) => {
      const { user_id, fecha_desde, fecha_hasta } = req.params;
      const gastos = await prisma.gasto.findMany({
        select: {
          monto: true,
          fecha: true,
          category: true,
          id: true,
          description:true
        },
        where: {
          user_id: Number(user_id),
          fecha: {
            lte: fecha_hasta,
            gte: fecha_desde,
          },
        },
        orderBy: {
          fecha: "desc",
        },
      });
      if (gastos.length == 0) {
        res.status(400).send("Todavía no has cargado ningún gasto");
        return;
      }
      res.json(gastos);
    }
  );

  router.post("/", async (req, res) => {
    const { monto, user_id, category_id, description } = req.body;

    const category = await prisma.categoryGasto.findUnique({
      where: { id: category_id }
    });
    
    if (!category || !category.activo) {
      res.status(400).send({ message: "La categoría seleccionada no es válida." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { Presupuesto: true },
    });
    if (!user) {
      res.status(400).send({ message: "Error al cargar los datos" });
      return;
    }
    const result = await prisma.gasto.create({
      data: {
        monto,
        fecha: new Date().toISOString(),
        description,
        user: {
          connect: {
            id: user_id,
          },
        },
        category: {
          connect: {
            id: category_id,
          },
        },
      },
    });

    await prisma.user.update({
      data: { saldo: user.saldo - monto },
      where: { id: user_id },
    });

    await prisma.presupuesto.updateMany({
      where: {
        descripcion: category.name,
      },
      data: {
        total_acumulado: {
          increment: monto,
        },
      },
    });

    res.json(result);
  });

  return router;
};

export default GastosRoute;

