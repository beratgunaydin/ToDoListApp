import { useState } from 'react';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ToDoCard from './ToDoCard';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', content_title: '', content: '', checked_control: false });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5038/api/todoapp/GetTasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = (taskTitle) => {
    const updatedTasks = tasks.filter(task => task.title !== taskTitle)
    setTasks(updatedTasks);

    fetch(`http://localhost:5038/api/todoapp/DeleteTasks/${taskTitle}`, {
      method: 'delete',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      fetchTasks();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const handleAddTaskOnClick = () => {
    setShowForm(true);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    fetch('http://localhost:5038/api/todoapp/AddTasks', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    })
    //fetchTasks();

    setShowForm(false);
    setTasks([...tasks, newTask]);
    setNewTask({ title: '', content_title: '', content: '', checked_control: false });
  }
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  }

  const handleUpdate = (updateTaskItem) => {
    const updatedTasks = [...tasks];
    const updatedTasksIndex = tasks.findIndex((task => task.id === updateTaskItem.id));

    const updatedTask = {
      id: updateTaskItem.id,
      title: updateTaskItem.title,
      content_title: updateTaskItem.content_title,
      content: updateTaskItem.content
    };

    updatedTasks[updatedTasksIndex] = updatedTask;
    console.log(updateTaskItem)
    console.log(updatedTasksIndex);
    console.log(updatedTasks);

    setTasks(updatedTasks);

    fetch('http://localhost:5038/api/todoapp/UpdateTasks', {
      method: 'put',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(updateTaskItem),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      }).catch(error => {
        console.error('Error', error);
      })
  }

  const handleCheckboxControl = (checkedControlTask) => {
    fetch('http://localhost:5038/api/todoapp/UpdateCheckedTask', {
      method: 'put',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(checkedControlTask),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      }).catch(error => {
        console.error('Error', error);
      })
  } 

  return (
    <> 
      <div id="header" className="navbar navbar-dark bg-dark">
        <h1 id="main-title">To Do List</h1>
      </div>

      <div id="to-do-list">
        {
          tasks.map((toDoTask) => (
            <ToDoCard toDoTask={toDoTask} onDelete={handleDelete} onUpdate={handleUpdate} onCheckboxControl={handleCheckboxControl}/>
          ))
        }
      </div>

      <div id='add-task-btn'>
        <button type="button" class="btn btn-outline-dark" onClick={handleAddTaskOnClick}>Add Task</button>
      </div>

      {showForm && (
        <div id="add-task-form">
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" className="form-control" name="title" value={newTask.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Content Title:</label>
              <input type="text" className="form-control" name="content_title" value={newTask.content_title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Content:</label>
              <input type="text" className="form-control" name="content" value={newTask.content} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;
