var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
const { WriteError } = require("mongodb");

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_STRING = "mongodb+srv://admin:password@cluster.puvszkd.mongodb.net/?retryWrites=true&w=majority";

var DATABASE_NAME = "todoappdb";
var database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database=client.db(DATABASE_NAME);
        console.log("MongoDB Connection Successful");
    });
});

app.get('/api/todoapp/GetTasks', (request, response) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        response.send(result);
    });
});

app.post('/api/todoapp/AddTasks', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    database.collection("todoappcollection").count({}, function(error, countOfTasks) {
        database.collection("todoappcollection").insertOne({
            id: (countOfTasks + 1),
            title: request.body.title,
            content_title: request.body.content_title,
            content: request.body.content,
            checked_control: request.body.checked_control,
        });
        response.json("Added Successfully");
    })
})

app.delete('/api/todoapp/DeleteTasks/:taskTitle', (request, response) => {
    const taskTitle = request.params.taskTitle;
  
    database.collection("todoappcollection").deleteOne({
      title: taskTitle
    }, (err, result) => {
      if (err) {
        console.error('Error:', err);
        response.status(500).json({ error: 'Internal Server Error' });
      } else {
        response.json({ message: 'Deleted Successfully' });
      }
    });
  });

app.put('/api/todoapp/UpdateTasks', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    console.log(request.body);

    database.collection('todoappcollection').updateOne(
        { id: request.body.id},
        { $set: { title: request.body.title, content_title: request.body.content_title, content: request.body.content}},
        (err, result) => {
            if(err) {
                console.error('Error updating task:', err);
                response.status(500).json({ error: 'Internal Server Error' });
            } else {
                response.json({ message: 'Task updated successfully' });
            }
        }
    );
});

app.put('/api/todoapp/UpdateCheckedTask', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    database.collection("todoappcollection").updateOne(
        { id: request.body.id },
        { $set: { checked_control: request.body.checked_control}},
        (err, result) => {
            if (err) {
                console.error('Error updating task:', err);
                response.status(500).json({ error: 'Internal Server Error' });
            } else {
                response.json({message: 'Task updated successfully'});
            }
        }
    );
});