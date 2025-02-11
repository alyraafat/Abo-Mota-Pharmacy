require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

// express app
const app = express();
const pharmacistRouter = require("./routes/pharmacistRouter");
const adminRouter = require("./routes/adminRouter");
const patientRouter = require("./routes/patientRouter");
const guestRouter = require("./routes/guestRouter");
const stripeRouter = require("./routes/stripeRouter");
const commonRouter = require("./routes/commonRouter");

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MongoURI = process.env.MONGO_URI;

// added for socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require("axios");

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://localhost:3001"],
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
	},
});

const activeUsers = {};


io.on("connection", (socket) => {
	console.log("Connection success");

	socket.on("user_connected", (userId) => {
		console.log("User connected:", userId);
		console.log(`activeUsers = ${activeUsers}`);
		activeUsers[userId] = socket.id;
	});

	socket.on("send_message", async (data) => {
		const {
			message,
			isRelayToClinic
		} = data;

		const { sender, recipient } = message;

		const senderSocketId = activeUsers[sender];
		io.to(senderSocketId).emit("receive_message", data);

		if (isRelayToClinic)
			await axios.post("http://localhost:5000/api/relay", data);

		else {
			const recipientSocketId = activeUsers[recipient];

			console.log(`activeUsers in send_message = ${JSON.stringify(activeUsers, null, 2)}`);

			if (recipientSocketId) {
				socket.to(recipientSocketId).emit("receive_message", data);
			}
		}

	});

	app.post("/pharmaApi/relay", (req, res) => {
		// console.log("Relaying message to clinic");
		// console.log(`req.body = ${JSON.stringify(req.body, null, 2)}`);

		const data = req.body;
		const { message: { recipient } } = data;

		console.log(`messge in pharmaApi relay = ${JSON.stringify(recipient, null, 2)}`);
		console.log(`recipient in pharmaApi relay = ${JSON.stringify(recipient, null, 2)}`);

		const recipientSocketId = activeUsers[recipient];

		console.log(`activeUsers in relay = ${JSON.stringify(activeUsers, null, 2)}`);

		if (recipientSocketId) {
			socket.to(recipientSocketId).emit("receive_message", data);
		}
	});

	//----------Notifications-------------//

	socket.on("send_notification_stock", ({ receiver, content }) => {
		const receiverSocket = activeUsers[receiver]; // get receiver socket id from activeUsers list
		socket.to(receiverSocket).emit("receive_notification_stock", { content });
	});
});



// mongo connection string
mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(err => {
		console.error('Error connecting to MongoDB', err);
	});
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'], credentials: true }));
app.use(cookieParser());
app.use(express.static(process.env.STATIC_DIR));
app.use(bodyParser.json());

// routes
app.use("/pharmaApi/patient", patientRouter);
app.use("/pharmaApi/pharmacist", pharmacistRouter);
app.use("/pharmaApi/admin", adminRouter);
app.use("/pharmaApi/guest", guestRouter);
app.use("/pharmaApi/stripe", stripeRouter);
app.use("/pharmaApi/common", commonRouter);

// listen for requests
// listen for requests

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

server.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`);
});

