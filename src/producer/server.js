const kafka = require("kafka-node");
const bodyParser = require("body-parser");

const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

try {
  /**
   * Kafka Producer Configuration
   */
  const Producer = kafka.Producer;
  const client = new kafka.KafkaClient(process.env.KAFKA_HOST);
  const producer = new Producer(client);
  const admin = new kafka.Admin(client);

  const topics = [
    { topic: "email-service", partitions: 1, replicationFactor: 1 }
  ];

  admin.createTopics(topics, (err, res) => {
    if (err) console.log("error in creating topics", err);
    console.log("Topics created / already created");
  });

  const kafka_topic = "email-service";

  producer.on("ready", async function() {
    console.log("Kafka Producer is Ready");
  });

  producer.on("error", function(err) {
    console.log(err);
    console.log("[kafka-producer -> " + kafka_topic + "]: connection errored");
    throw err;
  });

  mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then((err, res) => {
      console.log("MongoDB connected successfully");

      require("./routes")(app, producer, kafka_topic);
    });
} catch (e) {
  console.log(e);
}

app.listen(process.env.PORT, () => {
  console.log(`producer is listening to port${process.env.PORT}`);
});
