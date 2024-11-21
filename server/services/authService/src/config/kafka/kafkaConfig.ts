import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: process.env.SERVICE_NAME || "service",
    brokers: [process.env.KAFKA_BROKER as string],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
    groupId: `${process.env.SERVICE_NAME}-group`,
});
