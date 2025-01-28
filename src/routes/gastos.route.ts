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
          fecha: "desc", //más recientes primero
        },
      });
      if (gastos.length == 0) {
        res.status(400).send("Todavía no has cargado ningún gasto");
        return;
      }
      res.json(gastos);
    }
  );

  router.get("/por_fecha/:user_id/:fecha_desde/:fecha_hasta/", async (req, res) => {
      //para estadisticas
      const { fecha_desde, fecha_hasta, user_id } = req.params;
      const gastos = await prisma.gasto.groupBy({
        by: ["fecha"],
        where: {
          user_id: Number(user_id),

          fecha: {
            lte: fecha_hasta,
            gte: fecha_desde,
          },
        },
        _sum: { monto: true },
      });

      if (gastos.length == 0) {
        res.status(400).send();
        return;
      }
      res.json(gastos);
    }
  );

  router.get("/filtrar/:user_id/:cat_id/:fecha_desde/:fecha_hasta", async (req, res) => {
      const { user_id, cat_id, fecha_desde, fecha_hasta } = req.params;
      const gastos_filtrados = await prisma.gasto.findMany({
        select: {
          monto: true,
          fecha: true,
          category: true,
          id: true,
          description: true
        },
        where: {
          user_id: Number(user_id),
          fecha: {
            lte: fecha_hasta,
            gte: fecha_desde,
          },
          category_id: Number(cat_id),
        },
        orderBy: {
          fecha: "desc",
        },
      });
      if (gastos_filtrados.length == 0) {
        res.status(400).send();
        return;
      }
      res.json(gastos_filtrados);
    }
  );

  router.get("/agrupar_por_categoria/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const gastos_por_cate = await prisma.gasto.groupBy({
      by: ["category_id"],

      where: { user_id: Number(user_id) },
      _sum: { monto: true },
    });
    if (gastos_por_cate.length == 0) {
      res.status(400);
      return;
    }
    res.json(gastos_por_cate);
  });

  router.get("/agrupar_por_categoria_mensual/:user_id/:mes", async (req, res) => {
    const { user_id, mes } = req.params;
    let inicio = new Date(mes);
    inicio.setDate(1);
    let fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);
    const gastos_por_cate = await prisma.gasto.groupBy({
      by: ["category_id"],

      where: { user_id: Number(user_id),
        fecha: {
          lte: fin.toISOString(),
          gte: inicio.toISOString(),
        },
       },
      _sum: { monto: true },
    });
    if (gastos_por_cate.length == 0) {
      res.status(400).send("No hay gastos en ese rango");
      return;
    }
    res.json(gastos_por_cate);
  });

  router.post("/", async (req, res) => {
    const { monto, user_id, category_id, description } = req.body;

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

    const category = await prisma.categoryGasto.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      res.status(400).send({ message: "Error al cargar los datos" });
      return;
    }

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

  router.get("/unico/:gasto_id", async (req, res) => {
    const { gasto_id } = req.params;
    const result = await prisma.gasto.findUnique({
      select: {
        id: true,
        monto: true,
        fecha: true,
        category: true,
        description: true
      },
      where: {
        id: Number(gasto_id),
      },
    });
    res.json(result);
  });

  return router;
};

export default GastosRoute;
