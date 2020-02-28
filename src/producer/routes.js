const userModel = require("./userModel");
module.exports = (app, producer, kafka_topic) => {
  app.get("/getUser/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await userModel.getUserById(userId);

      res.status(200).send({
        success: true,
        data: user,
        error: null
      });
    } catch (e) {
      console.log(e);

      res.status.send({
        success: false,
        data: null,
        error: e
      });
    }
  });

  app.post("/insertUser", async (req, res) => {
    const user = {
      email: req.body.email
    };

    try {
      const insertedUser = await userModel.insertUser(user);

      if (insertedUser) {
        let payload = [
          {
            topic: kafka_topic,
            messages: JSON.stringify({
              type: "NEW_USER_SIGNUP",
              data: insertedUser
            })
          }
        ];

        producer.send(payload, (err, data) => {
          if (err) {
            console.log(
              "[kafka-producer -> " + kafka_topic + "]: broker update failed"
            );
          }

          console.log(
            "[kafka-producer -> " + kafka_topic + "]: broker update success"
          );
        });
        res.status(200).send({
          success: true,
          data: insertedUser,
          error: null
        });
      }
    } catch (e) {
      console.log(e);

      res.status(500).send({
        success: false,
        data: null,
        error: e
      });
    }
  });
};
