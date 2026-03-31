import { Webhook } from 'svix';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
  // Aquí recibes el secreto del Webhook que Clerk te dará (luego lo pondremos en .env.local)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Falta configurar CLERK_WEBHOOK_SECRET en .env.local');
    return new Response('Error: Internal Server Error', { status: 500 });
  }

  // Extraemos los headers de seguridad enviados por Clerk (usando Svix)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si no vienen los headers, es un intento de hackeo, bloqueamos
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error de autenticidad: Faltan cabeceras svix', { status: 400 });
  }

  // Extraemos el cuerpo del evento
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  // Verificamos matemáticamente que este POST fue enviado por Clerk y no por un impostor
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verificando la firma del Webhook:', err);
    return new Response('Error verificando firma', { status: 400 });
  }

  // --- ACÁ OCURRE LA MAGIA ---
  // Extraemos el tipo de evento y el ID del usuario
  const { id } = evt.data;
  const eventType = evt.type;

  // Si el evento fue que una cuenta se ha eliminado...
  if (eventType === 'user.deleted') {
    try {
      await connectToDatabase();
      // ¡Borramos al usuario de nuestro MongoDB asociado a ese Clerk ID!
      const deletedInfo = await User.deleteOne({ clerkId: id });
      
      if (deletedInfo.deletedCount > 0) {
        console.log(`✅ EXITO: Usuario eliminado en MongoDB (ClerkID: ${id})`);
      } else {
        console.log(`⚠️ AVISO: Se recibió la orden de borrar a ${id}, pero no estaba en MongoDB.`);
      }
    } catch (error) {
      console.error('❌ Error al intentar eliminar usuario de MongoDB:', error);
      return new Response('Error DB', { status: 500 });
    }
  }

  return new Response('Webhook procesado con éxito', { status: 200 });
}
