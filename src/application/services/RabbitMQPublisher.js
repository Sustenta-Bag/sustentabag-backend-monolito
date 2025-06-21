import amqp from "amqplib";
import { v4 } from "uuid";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

const exchange = "process_notification_exchange";
const routingKey = "notification";

export default async (data) => {
  let connection;

  try {
    const RABBITMQ = process.env.RABBITMQ;
    console.log(colors.yellow(`Conectando ao RabbitMQ: ${RABBITMQ}`));

    connection = await amqp.connect(RABBITMQ);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: true });

    const correlationId = v4();
    const timestamp = new Date();

    const message = {
      eventType: "NotificationRequested",
      version: "1.0",
      producer: "sustentabag-backend",
      timestamp: timestamp,
      correlationId: correlationId,
      data: {
        to: data.to,
        notification: {
          title: data.notification.title,
          body: data.notification.body,
        },
        type: data.type || "bulk",
        data: data.payload || {},
        userId: data.userId,
        timestamp: timestamp.toISOString(),
      },
    };

    console.log(
      colors.blue("Publicando mensagem:"),
      JSON.stringify(message, null, 2)
    );

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        messageId: correlationId,
        contentType: "application/json",
        timestamp: timestamp.getTime(),
        persistent: true,
      }
    );

    console.log(
      colors.green(
        `Mensagem publicada com sucesso! Correlation ID: ${correlationId}`
      )
    );

    await channel.close();
    return { success: true, correlationId };
  } catch (err) {
    console.error(colors.red("Erro ao publicar mensagem:"), err.message);
    throw new Error(`Falha ao publicar mensagem no RabbitMQ: ${err.message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error(
          colors.yellow("Erro ao fechar conexão:"),
          closeErr.message
        );
      }
    }
  }
};
