import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const Ahorro_PresupuestoRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/', async (req, res) => {
        const { monto, fecha,user_id,presupuesto_id } = req.body;

        //chequear que los datos sean correctos
        const user =await prisma.user.findUnique({
            where: {id:user_id}
        })
        const presupuesto = await prisma.presupuesto.findUnique({
            where: {id:presupuesto_id}
        })
        if (!user || !presupuesto){
            res.status(400).send({message: "Error al cargar los datos"})
            return
        }

        const result = await prisma.ahorro_Presupuesto.create({
            data:{
                monto, fecha,presupuesto_id
            }
        })

        //actualizar el saldo total y lo acumulado 
        await prisma.user.update({
            data: {saldo: user.saldo-monto},
            where: {id:user_id}
        })
        await prisma.presupuesto.update({
            data: {total_acumulado: presupuesto.total_acumulado+monto},
            where: {id: presupuesto_id}
        })

        res.json(result);
    })
    router.get('/:presupuesto_id',  async (req, res) =>{
        const {presupuesto_id}=req.params;
        const result = await prisma.ahorro_Presupuesto.findMany({
            select: {monto:true,fecha:true},
            where: {presupuesto_id: parseInt(presupuesto_id)}
        })
        res.json(result);
    })

    
    return router
}

export default Ahorro_PresupuestoRoute;