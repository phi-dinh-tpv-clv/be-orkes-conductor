import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaClientOptions: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'om-com-workflow-service-consumer',
      connectionTimeout: 4500,
      brokers: [process.env.KAFKA_BROKER_URI],
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    postfixId: '',
  },
};
