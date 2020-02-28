const kafka = require("kafka-node");
const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

try {
  console.log("kafka consumer is starting up");
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient(process.env.KAFKA_HOST);
  let consumer = new Consumer(
    client,
    [{ topic: "email-service", partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: "utf8",
      fromOffset: false
    }
  );
  consumer.on("message", message => {
    const consumerData = JSON.parse(message.value);
    console.log(consumerData);
    if (consumerData.type === "NEW_USER_SIGNUP") {
      // write the logic to send the email to admin
      if (consumerData.data)
        console.log(
          `User user signed up with email ${consumerData.data.email}`
        );
    }
  });
  consumer.on("error", err => {
    console.log("error", err);
  });
} catch (e) {
  console.log(e);
}
app.listen(process.env.PORT, () => {
  console.log(`consumer is listening to port ${process.env.PORT}`);
});
