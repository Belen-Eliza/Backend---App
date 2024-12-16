import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import crypto from 'crypto'; // To generate the token
import sendRecoveryEmail from "../../mailer"

const passwordRoute = (prisma: PrismaClient) => {
  const router = express.Router();

  // Route to send recovery token
  router.post('/password-recovery', async (req: Request, res: Response) => {
    console.log("Boca");
    const { email } = req.body;
    const emaill = email.toLowerCase();
    console.log('Request body:', req.body);

    try {
      const user = await prisma.user.findUnique({ where: { mail: emaill } });
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado.' });
        return 
      }

      // Generate a 6-digit token
      const token = crypto.randomInt(100000, 999999).toString();
      const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);
      console.log(token)
      // Save the token in the PasswordRecoveryToken table
      await prisma.passwordRecoveryToken.create({
        data: {
          token,
          expiresAt: tokenExpiration,
          user: { connect: { id: user.id } },
        },
      });

      // Send recovery email
      await sendRecoveryEmail(emaill, token);

      res.json({ message: 'Correo de recuperación enviado.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error enviando el correo de recuperación.' });
    }
  });
  router.post('/verify-token', async (req, res) => {
    const { email, token } = req.body;
  
    if (!email || !token) {
       res.status(400).json({ error: 'mail y token son requeridos' });
       return
    }
    console.log(token)
  
    try {
      
      // Obtener el último token asociado al usuario
      const tokenRecord = await prisma.passwordRecoveryToken.findFirst({
        where: {
          user: {
            mail:email.toLowerCase(), // Filtrar por el email del usuario asociado
          },
        },
        orderBy: {
          createdAt: 'desc', // Asegura obtener el token más reciente
        },
      
      });
      
      // Verificar si se encontró un token
      console.log(tokenRecord)

      if (!tokenRecord) {
         res.status(404).json({ error: 'No se encontró un token para el usuario.' });
         return
      }
  
      // Comparar el token
      console.log(tokenRecord.token === token)
      if (tokenRecord.token === token) {

         res.status(200).json({ message: 'El token es válido.' });
         return
      } else {
         res.status(401).json({ error: 'El token es inválido.' });
         return
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
       res.status(500).json({ error: 'Error interno del servidor.' });
       return
    }}),
  // Route to reset password
  router.post('/reset-password', async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
      // Verify the token
      const tokenRecord = await prisma.passwordRecoveryToken.findFirst({
        where: { token },
        include: { user: true },
        orderBy: {
          createdAt: 'desc', // Ordena por la fecha de creación en orden descendente
        },
      });
      

      if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
         res.status(400).json({ message: 'Token inválido o expirado.' });
         return
      }

      // Update the user's password
      await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: newPassword }, // Ideally, you should hash the password before saving
      });

      // Delete the used token
      await prisma.passwordRecoveryToken.deleteMany({
        where: { token },
      });

      res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error actualizando la contraseña.' });
    }
  });

  return router;
};

export default passwordRoute;
