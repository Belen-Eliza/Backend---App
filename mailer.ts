import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { json } from 'stream/consumers';

dotenv.config(); // Cargar las variables de entorno



// Función para enviar el correo de recuperación
const sendRecoveryEmail = async (to: string, token: string) => {
  // Configura SendGrid con tu clave API
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SendGrid API Key is missing');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  try {
    const msg = {
      to, // Destinatario
      from: 'agusotero@uca.edu.ar', // Remitente (puede ser tu correo verificado en SendGrid)
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${token}`,
      html: `<p>Tu código de recuperación es: <strong>${token}</strong></p>`,
    };

    // Enviar el correo
    console.log("llegue")
    await sgMail.send(msg);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error enviando el correo:',JSON.stringify(error,null,2));
    throw new Error('No se pudo enviar el correo.');
  }
  // console.log(process.env.SENDGRID_API_KEY)
};

export default sendRecoveryEmail;
