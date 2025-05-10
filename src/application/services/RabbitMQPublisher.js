import amqp from "amqplib";
import { v4 } from "uuid";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

const exchange = "process_notification_exchange";
const routingKey = "notification";

export default async (data) => { // TODO - Refatorar para um serviço de mensagens genéricas
  let connection;

  try {
    const RABBITMQ = process.env.RABBITMQ;
    console.log(colors.yellow(`Conectando ao RabbitMQ: ${RABBITMQ}`));
    
    connection = await amqp.connect(RABBITMQ);
    const channel = await connection.createChannel();

    // Garantir que a exchange exista
    await channel.assertExchange(exchange, "direct", { durable: true });
    
    // Adicionar identificadores úteis à mensagem
    const messageId = v4();
    const timestamp = new Date();
    
    const message = {
      to: "token FCM ", // data.to e se for bulk :  "to": ["token1", "token2", "token3"],
      notification: {
        title: data.notification.title,
        body: data.notification.body,
      },
      data: {
        type: "single", // "type": "bulk",
        payload: {
          ...data.payload,
          timestamp: timestamp,
          correlationId: messageId,
        },
      }
    };
    
    console.log(colors.blue("Publicando mensagem:"), JSON.stringify(message, null, 2));
    
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        messageId: messageId,
        contentType: 'application/json',
        timestamp: timestamp.getTime(),
        persistent: true
      }
    );

    console.log(colors.green(`Mensagem publicada com sucesso! ID: ${messageId}`));
    
    await channel.close();
    return { success: true, messageId };
  } catch (err) {
    console.error(colors.red("Erro ao publicar mensagem:"), err.message);
    throw new Error(`Falha ao publicar mensagem no RabbitMQ: ${err.message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error(colors.yellow("Erro ao fechar conexão:"), closeErr.message);
      }
    }
  }
};