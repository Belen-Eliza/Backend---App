import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const GastosFijosRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/', async (req, res) => {
        var { monto, cant_meses, fecha_inicial,user_id,category_id } = req.body;
        if (fecha_inicial===undefined) {
            fecha_inicial=Date.now().toString();
        }
        const result = await prisma.gastoFijo.create({
          data: {
            monto, 
            cant_meses,
            fecha_inicial,
            user_id,
            category_id
          },
        })
        res.json(result);
    })
    router.get('/todos',  async (req, res) =>{ //todos los GF del usuario
        const {user_id}=req.body();
        const result = await prisma.gastoFijo.findMany({
            select: {monto:true,fecha_inicial:true,cant_meses:true,category_id:true},
            where: {user_id: user_id}
        })
        res.json(result);
    })

    router.get('/',async (req, res) =>{ 
        const {id_gasto}=req.body();
        const result = await prisma.gastoFijo.findUnique({
            select: {monto:true,fecha_inicial:true,cant_meses:true,category_id:true},
            where: {id: id_gasto}
        })
        res.json(result);
    })

    
    return router
}

export default GastosFijosRoute;