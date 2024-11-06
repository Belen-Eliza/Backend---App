import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const CategoriaRoute = (prisma: PrismaClient)=>{
    const router = Router();
    
    router.get('/categoriasGastos',  async (req, res) =>{
        const result = await prisma.categoryGasto.findMany({
            select: {id:true,name:true,description:true},
        })
        res.json(result);
    })
    router.get('/categoriaGasto',  async (req, res) =>{
        const {id_cat}=req.body();
        const result = await prisma.categoryGasto.findUnique({
            
            where: {id: id_cat}
        })
        res.json(result);
    })

    router.get('/categoriasIngresos',  async (req, res) =>{
        const result = await prisma.categoryIngreso.findMany({
            select: {id:true,name:true,description:true},
        })
        res.json(result);
    })
    router.get('/categoriaIngreso',  async (req, res) =>{
        const {id_cat}=req.body();
        const result = await prisma.categoryIngreso.findUnique({
            
            where: {id: id_cat}
        })
        res.json(result);
    })
    
    return router
}

export default CategoriaRoute;