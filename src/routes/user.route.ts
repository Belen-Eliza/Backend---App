import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router, type Express } from "express"

const UserRoute = (prisma: PrismaClient)=>{
    const router = Router();

    router.get('/login', async (req, res) => {
        const {email, password_attempt} = req.query
        const user = await prisma.user.findUnique({
          where: {
            mail: email as string,
          }
        })
        if(!user || user.password!=password_attempt){
            res.status(400).send("Usuario o contraseña incorrectos")
            return
        }
        res.json(user)
    })
    router.post('/signup', async (req, res) => {
        const { name, mail, password } = req.body;
        const result = await prisma.user.create({
          data: {
            name,
            mail,
            password,
            saldo: 0  //que empiece en 0 y se vaya cargando o cargar valor inicial??
          },
        })
        res.json(result);
    })

    router.patch('/edit_profile',async (req, res) => {
        const { id_user, new_name, new_mail, new_password } = req.body;
        const result = await prisma.user.update({
            data: {
                name:new_name, //una ruta para cambiar cada uno o todos juntos??
                mail: new_mail,
                password: new_password
            },
            where: {
                id: id_user
            },
        })

        res.json(result);
    })
    return router
}

export default UserRoute;