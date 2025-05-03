import amqp from "amqplib";
import { v4 } from "uuid";

const exchange = "process_notification_exchange";
const routingKey = "notification";

export default async (data) => {
  let connection;

  try {
    connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", { durable: true });
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(
        JSON.stringify({
          to: "GG7YEvoNUYh1qohZUmTSJRHu9fa2", // firebaseId token
          notification: {
            title: data.notification.title,
            body: data.notification.body,
          },
          data: {
            type: data.type,
            payload: {
              ...data.payload,
              timestamp: new Date(),
              correlationId: v4(),
            },
          },
        })
      )
    );

    await channel.close();
  } catch (err) {
    throw new Error(err.message);
  } finally {
    if (connection) await connection.close();
  }
};
