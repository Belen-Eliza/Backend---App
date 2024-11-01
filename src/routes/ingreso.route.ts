import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const IngresoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/cargar_ingreso', async (req, res) => {
        const { monto, descripcion,user_id,category_id } = req.body;
        const result = await prisma.ingreso.create({
            data:{
                monto, description:descripcion, category_id, user_id
            }
        })
        const estado_anterior = await prisma.user.findUnique({
            select: {saldo:true},
            where: {id:user_id}
        })
        var nuevo_saldo = estado_anterior==null ? monto : estado_anterior.saldo +monto;
        await prisma.user.update({
            data: {saldo: nuevo_saldo},
            where: {id:user_id}
        })
        res.json(result);
    })
    router.get('/ingresos',  async (req, res) =>{
        const {user_id}=req.body();
        const result = await prisma.ingreso.findMany({
            select: {monto:true,category_id:true,description:true},
            where: {user_id: user_id}
        })
        res.json(result);
    })

    
    return router
}

export default IngresoRoute;