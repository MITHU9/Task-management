require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Middleware
app.set("io", io);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hmzg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("taskStore").collection("users");

    const taskCollection = client.db("taskStore").collection("tasks");

    // WebSocket Connection
    io.on("connection", (socket) => {
      console.log("🔗 User connected:", socket.id);

      //add  a new task

      socket.on(
        "addTask",
        async ({ userMail, title, description, category }) => {
          try {
            const task = {
              category,
              title,
              description,
              createdAt: new Date(),
              userMail,
            };
            await taskCollection.insertOne(task);
            const tasks = await taskCollection.find().toArray();
            socket.emit("taskUpdated", tasks);
          } catch (error) {
            console.error("❌ Failed to add task:", error);
            socket.emit("error", "Failed to add task");
          }
        }
      );

      // Send all tasks to the newly connected client
      socket.on("getTasks", async () => {
        try {
          const tasks = await taskCollection.find().toArray();
          socket.emit("taskUpdated", tasks);
        } catch (error) {
          console.error("❌ Failed to fetch tasks:", error);
          socket.emit("error", "Failed to fetch tasks");
        }
      });

      //update task details
      socket.on("editTask", async ({ _id, title, description }) => {
        try {
          if (!ObjectId.isValid(_id)) {
            return socket.emit("error", "Invalid Task ID");
          }

          await taskCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { title, description } }
          );
          const tasks = await taskCollection.find().toArray();
          io.emit("taskUpdated", tasks);
        } catch (error) {
          console.error("❌ Task update failed:", error);
          socket.emit("error", "Task update failed");
        }
      });

      // Handle task category update (drag & drop between columns)
      socket.on("updateTask", async ({ taskId, category }) => {
        try {
          if (!ObjectId.isValid(taskId)) {
            return socket.emit("error", "Invalid Task ID");
          }
          await taskCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: { category } }
          );
          const tasks = await taskCollection.find().toArray();
          io.emit("taskUpdated", tasks);
        } catch (error) {
          console.error("❌ Task update failed:", error);
          socket.emit("error", "Task update failed");
        }
      });

      // Handle task deletion
      socket.on("deleteTask", async (taskId) => {
        console.log("taskId", taskId);

        try {
          if (!ObjectId.isValid(taskId)) {
            return socket.emit("error", "Invalid Task ID");
          }
          await taskCollection.deleteOne({ _id: new ObjectId(taskId) });
          const tasks = await taskCollection.find().toArray();
          io.emit("taskUpdated", tasks);
        } catch (error) {
          console.error("❌ Task deletion failed:", error);
          socket.emit("error", "Task deletion failed");
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });

    //auth related APIs
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({
          success: true,
        });
    });

    //verify token
    const verifyToken = (req, res, next) => {
      const token = req.cookies?.token;
      if (!token) {
        return res
          .status(401)
          .send({ message: "Access Denied! unauthorized user" });
      }
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
      } catch (error) {
        res.status(400).send({ message: "Invalid Token" });
      }
    };

    //add a new user to the database
    app.post("/new-user", async (req, res) => {
      const userData = req.body;

      const user = await userCollection.findOne({ email: userData.email });

      if (!user) {
        await userCollection.insertOne(userData);
      }
      res.send({ success: true });
    });

    //clear cookie on logout
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    //add new task in tasks array
    app.post("/add-task", verifyToken, async (req, res) => {
      const { title, description, category } = req.body;
      const user = req.user;

      const task = {
        category,
        title,
        description,
        createdAt: new Date(),
        userMail: user.email,
      };

      await taskCollection.insertOne(task);

      res.send({ success: true });
    });

    //get all tasks
    app.get("/all-tasks", verifyToken, async (req, res) => {
      try {
        const user = req.user;

        const tasks = await taskCollection
          .find({ userMail: user.email })
          .toArray();

        res.send(tasks);
      } catch (error) {
        res.status(500).send({ message: "Error fetching tasks", error });
      }
    });

    //update task category

    app.patch("/update-task-category/:id", verifyToken, async (req, res) => {
      const taskId = req.params.id;
      const { category } = req.body;

      await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { category: category } }
      );

      res.send({ success: true });
    });

    //update task
    app.patch("/update-task/:id", verifyToken, async (req, res) => {
      const taskId = req.params.id;
      const { category } = req.body;

      //console.log("taskId", taskId, "category", category);

      await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { category: category } }
      );
      res.send({ success: true });
    });

    //edit task details
    app.put("/update-task/:id", verifyToken, async (req, res) => {
      const taskId = req.params.id;
      const taskData = req.body;

      const filter = { _id: new ObjectId(taskId) };

      const options = { upsert: true };

      //console.log("taskData", taskData, "taskId", taskId);

      const updateDoc = {
        $set: {
          title: taskData.title,
          description: taskData.description,
        },
      };

      await taskCollection.updateOne(filter, updateDoc, options);

      res.send({ success: true });
    });

    //delete task
    app.delete("/delete-task/:id", verifyToken, async (req, res) => {
      const taskId = req.params.id;

      await taskCollection.deleteOne({ _id: new ObjectId(taskId) });

      res.send({ success: true });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
