import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"
import { connect } from "http2";

const GastosFijosRoute = (prisma: PrismaClient)=>{
    const router = Router();
    router.post('/', async (req, res) => {
        var {user_id, monto, cant_meses, fecha_inicial,category_id } = req.body;
        if (fecha_inicial===undefined) {
            fecha_inicial=Date.now().toString();
        }
        const result = await prisma.gastoFijo.create({
          data: {
            monto, 
            cant_meses,
            fecha_inicial,
            user_id,
            user:{
                connect:{
                    id:user_id
                }
            },
            category_id,
            category: {
                connect:{
                    id:category_id
                }
            }
          },
        })
        res.json(result);
    })
    router.get('/todos/:user_id',  async (req, res) =>{ //todos los GF del usuario
        const {user_id}=req.params;
        const result = await prisma.gastoFijo.findMany({
            select: {monto:true,fecha_inicial:true,cant_meses:true,category_id:true},
            where: {user_id: parseInt(user_id)}
        })
        res.json(result);
    })

    router.get('/:id_gasto',async (req, res) =>{ 
        const {id_gasto}=req.params;
        const result = await prisma.gastoFijo.findUnique({
            select: {monto:true,fecha_inicial:true,cant_meses:true,category_id:true},
            where: {id: parseInt(id_gasto)}
        })
        res.json(result);
    })

    
    return router
}

export default GastosFijosRoute;