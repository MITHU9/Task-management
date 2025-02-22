require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-management-by-mithu9.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

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
    //await client.connect();

    const userCollection = client.db("taskStore").collection("users");

    const taskCollection = client.db("taskStore").collection("tasks");

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
    app.post("/add-task", async (req, res) => {
      const { userMail, title, description, category } = req.body;

      const task = {
        category,
        title,
        description,
        createdAt: new Date(),
        userMail,
      };

      await taskCollection.insertOne(task);

      res.send({ success: true });
    });

    //get all tasks
    app.get("/all-tasks/:email", async (req, res) => {
      try {
        const email = req.params.email;

        //console.log("email", email);

        const tasks = await taskCollection.find({ userMail: email }).toArray();

        //console.log("tasks", tasks);

        res.send(tasks);
      } catch (error) {
        res.status(500).send({ message: "Error fetching tasks", error });
      }
    });

    //update task category

    app.patch("/update-task-category/:id", async (req, res) => {
      const taskId = req.params.id;
      const { category } = req.body;

      await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { category: category } }
      );

      res.send({ success: true });
    });

    //update task
    app.patch("/update-task/:id", async (req, res) => {
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
    app.put("/update-task/:id", async (req, res) => {
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
    app.delete("/delete-task/:id", async (req, res) => {
      const taskId = req.params.id;

      await taskCollection.deleteOne({ _id: new ObjectId(taskId) });

      res.send({ success: true });
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
