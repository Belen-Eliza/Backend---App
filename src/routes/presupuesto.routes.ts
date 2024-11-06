import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const PresupuestoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/cargar_presupuesto', async (req, res) => {
        const { montoTotal, descripcion,user_id,fecha_objetivo,cant_cuotas } = req.body;
        const result = await prisma.presupuesto.create({
            data:{
                montoTotal,descripcion,cant_cuotas,fecha_objetivo,user_id,total_acumulado:0
            }
        })
        
        res.json(result);
    })
    router.get('/todos',  async (req, res) =>{
        const {user_id}=req.body();
        const result = await prisma.presupuesto.findMany({
            select: {descripcion:true,montoTotal:true,fecha_objetivo:true},
            where: {user_id: user_id},
            orderBy: {fecha_objetivo:"desc"}
        })
        res.json(result);
    })
    router.get('/',  async (req, res) =>{
        const {id_presupuesto}=req.body();
        const result = await prisma.presupuesto.findUnique({
            select: {descripcion:true,montoTotal:true,cant_cuotas:true,fecha_objetivo:true,total_acumulado:true},
            where: {id: id_presupuesto}
        })
        res.json(result);
    })

    
    return router
}

export default PresupuestoRoute;