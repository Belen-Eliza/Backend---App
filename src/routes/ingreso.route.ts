import { type PrismaClient, type Prisma } from "@prisma/client";
import { Router } from "express";

const IngresoRoute = (prisma: PrismaClient) => {
    const router = Router();

    router.get('/historial/:user_id/:fecha_desde/:fecha_hasta', async (req, res) => { 
        const { user_id, fecha_desde, fecha_hasta } = req.params;
        const ingresos = await prisma.ingreso.findMany({
            select: { monto: true, fecha: true, category: true },
            where: {
                user_id: Number(user_id),
                fecha: {
                    lte: new Date(fecha_hasta), // Convertido a Date
                    gte: new Date(fecha_desde), // Convertido a Date
                },
            },
            orderBy: { fecha: "desc" },
        });
        if (ingresos.length === 0) {
            res.status(400).send("Todavía no has cargado ningún ingreso");
            return;
        }
        res.json(ingresos);
    });

    router.get('/por_fecha/:user_id/:fecha_desde/:fecha_hasta', async (req, res) => {
        const { fecha_desde, fecha_hasta, user_id } = req.params;
        const ingresos = await prisma.ingreso.findMany({
            select: { monto: true,fecha: true, category: true },
            where: {
                user_id: Number(user_id),
                fecha: {
                    lte: new Date(fecha_hasta), // Convertido a Date
                    gte: new Date(fecha_desde), // Convertido a Date
                },
            },
            orderBy: { fecha: "asc" },
        });
        res.json(ingresos); // Agregada respuesta JSON
    });

    router.post('/', async (req, res) => {
        const { monto, descripcion, user_id, category_id, fecha } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: user_id },
        });
        if (!user) {
            res.status(400).send({ message: "Error al cargar los datos" });
            return;
        }

        const result = await prisma.ingreso.create({
            data: {
                monto,
                description: descripcion,
                fecha: (new Date()).toISOString(),
                user: { connect: { id: user_id } },
                category: { connect: { id: category_id } },
            },
        });

        await prisma.user.update({
            data: { saldo: user.saldo + monto },
            where: { id: user_id },
        });

        res.json(result);
    });

    router.get('/:user_id', async (req, res) => {
        const { user_id } = req.params;
        const result = await prisma.ingreso.findMany({
            select: { id: true, monto: true, category: true, description: true },
            where: { user_id: parseInt(user_id) },
        });
        res.json(result);
    })
    router.get('/unico/:ingreso_id',  async (req, res) =>{
        const {ingreso_id}=req.params;
        const result = await prisma.ingreso.findUnique({
            select: {id:true,monto:true,category:true,description:true},
            where: {id: parseInt(ingreso_id)}
        })
        res.json(result);
    })

    

    return router;
};



export default IngresoRoute;
