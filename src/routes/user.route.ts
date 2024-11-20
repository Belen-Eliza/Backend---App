import { type PrismaClient, type Prisma } from "@prisma/client"
import { Router } from "express"

const UserRoute = (prisma: PrismaClient)=>{
  const router = Router();

  router.get('/:id',async (req,res)=>{
    const {id}= req.params;
    const user = await prisma.user.findUnique({
      select: {
        id:true, mail:true,name:true,password:true,saldo:true
      },
      where: {
        id: parseInt(id)
      }
    })
    if(!user ){
      res.status(400).send("Ocurrió un error")
      return
    }
    res.json(user);
  })
  router.post('/login', async (req, res) => {
      const {email, password_attempt} = req.body;
      const mail_normalizado =email.toLowerCase();
      const user = await prisma.user.findUnique({
        select: {
          id:true, mail:true,name:true,password:true,saldo:true
        },
        where: {
          mail: mail_normalizado
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
    const mail_normalizado =mail.toLowerCase();
    try {
      const result = await prisma.user.create({
        data: {
          name,
          mail:mail_normalizado,
          password
        },
      })
    res.json(result);
    }
    catch(e){
      console.log(req)
    }
      
  })
  router.patch('/edit_profile/:id',async (req, res) => { 
    const {id} =req.params;
    const { new_name, new_mail, new_password } = req.body; //no mandar atributos a no actualizar, o chequear
    const result = await prisma.user.update({
        data: {
            name:new_name, 
            mail: new_mail.toLowerCase(),
            password: new_password
        },
        where: {
            id: parseInt(id)
        },
    })

      res.json(result);
  })
  return router
}

export default UserRoute;