import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const PresupuestoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/', async (req, res) => {
        const { montoTotal, descripcion,user_id,fecha_objetivo,cant_cuotas } = req.body;
        const result = await prisma.presupuesto.create({
            data:{
                montoTotal,descripcion,cant_cuotas,fecha_objetivo,total_acumulado:0,
                user: {
                    connect:{
                        id:user_id
                    }
                }
            }
        })
        
        res.json(result);
    })
    router.get('/todos/:user_id',  async (req, res) =>{
        const {user_id}=req.params;
        const result = await prisma.presupuesto.findMany({
            select: {id:true,descripcion:true,montoTotal:true,fecha_objetivo:true},
            where: {user_id: parseInt(user_id)},
            orderBy: {fecha_objetivo:"desc"}
        })
        res.json(result);
    })
    router.get('/unico/:presupuesto_id',  async (req, res) =>{
        const {presupuesto_id}=req.params;
        const result = await prisma.presupuesto.findUnique({
            select: {descripcion:true,montoTotal:true,cant_cuotas:true,fecha_objetivo:true,total_acumulado:true},
            where: {id: parseInt(presupuesto_id)}
        })
        res.json(result);
    })

    
    return router
}

export default PresupuestoRoute;