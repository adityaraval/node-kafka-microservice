# NodeJs Kafka Microservice Demo

Simple NodeJs Microservice example using Kafka Pubsub to demonstrate how the new user signed up to the system from User Service(producer) and how the admin will be notified via email about the new user in Email Service(consumer).

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependancies.

```bash
npm install
```

## ENV Setup for Producer
```javascript
cd producer
touch .env

#add following values to the .env
PORT=3000
DB_URL=mongodb://localhost:27017/nodekafka
KAFKA_HOST=localhost:9092
```

## ENV Setup for Consumer
```javascript
cd consumer
touch .env

#add following values to the .env
PORT=3000
KAFKA_HOST=localhost:9092
```

## Start Producer

```javascript
cd producer
node server.js
```
## Start Consumer

```javascript
cd consumer
node server.js
```

## Request an Endpoint to test producer
```
curl --location --request POST 'localhost:3000/insertUser' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email":"adityaraval@gmail.com"
}'
```

## Consumer output
```
{
  type: 'NEW_USER_SIGNUP',
  data: {
    _id: '5e58d964ca98ca21ccde83ee',
    email: 'adityaraval@gmail.com',
    createdAt: '2020-02-28T09:12:04.096Z',
    updatedAt: '2020-02-28T09:12:04.096Z',
    __v: 0
  }
}
User user signed up with email adityaraval@gmail.com
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)