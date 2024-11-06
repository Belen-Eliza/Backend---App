import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const CategoriaRoute = (prisma: PrismaClient)=>{
    const router = Router();
    
    router.get('/de_gastos',  async (req, res) =>{ //todas las categorias de gastos
        const result = await prisma.categoryGasto.findMany({
            select: {id:true,name:true,description:true},
        })
        res.json(result);
    })
    router.get('/',  async (req, res) =>{  //categoria de un gasto especifico
        const {id_cat}=req.body();
        const result = await prisma.categoryGasto.findUnique({
            
            where: {id: id_cat}
        })
        res.json(result);
    })

    router.get('/de_ingresos',  async (req, res) =>{  //todas las categorias de ingresos
        const result = await prisma.categoryIngreso.findMany({
            select: {id:true,name:true,description:true},
        })
        res.json(result);
    })
    router.get('/ingreso',  async (req, res) =>{ //categoria de un ingreso especifico
        const {id_cat}=req.body();
        const result = await prisma.categoryIngreso.findUnique({
            
            where: {id: id_cat}
        })
        res.json(result);
    })
    
    return router
}

export default CategoriaRoute;