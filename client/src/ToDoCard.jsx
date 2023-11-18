import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ToDoCard.css'

const ToDoCard = ({ toDoTask, onDelete, onUpdate, onCheckboxControl }) => {
    console.log(toDoTask);
    const green = "#198754";
    const light = "#f8f9fa";
    const dark = "#212529";
  
    const toDoCardsStyleDone = {
      backgroundColor: green,
      color: light,
    };
  
    const toDoCardsStyleNotFinished = {
      backgroundColor: light,
      color: dark,
    };
  
    const [checkCheckbox, setCheckCheckbox] = useState(toDoTask.checked_control);
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ id: 0, title: '', content_title: '', content: '' });
  
    const handleCheckboxChange = (event) => {
      setCheckCheckbox(event.target.checked);
      toDoTask.checked_control = event.target.checked;
      onCheckboxControl(toDoTask);
    };
  
    const handleDeleteButtonOnClick = () => {
      onDelete(toDoTask.title);
    };

    const handleUpdateButtonClick = () => {
      setShowForm(true);
    }

    const handleUpdateFormSubmit = (event) => {
      event.preventDefault();

      const updatedTaskItem = {
        id: toDoTask.id,
        title: newTask.title,
        content_title: newTask.content_title,
        content: newTask.content
      };

      onUpdate(updatedTaskItem);

      setShowForm(false);
    };

    const handleUpdateInputChange = (event) => {
      const { name, value } = event.target;
      setNewTask({ ...newTask, [name]: value });
    };
  
    return (
      <>
        <div id="to-do-card" className="card bg-light mb-3">
          <div
            className="card-header"
            style={toDoTask.checked_control ? toDoCardsStyleDone : toDoCardsStyleNotFinished}
          >
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleUpdateButtonClick}
            >
              Update Task
            </button>
            {toDoTask.title}
            <div>
              <button
                className="btn btn-outline-warning btn-sm"
                style={{ marginRight: "0.5em" }}
                onClick={handleDeleteButtonOnClick}
              >
                {" "}
                Delete Task
              </button>
              <input
                type="checkbox"
                checked={checkCheckbox}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div
            className="card-body"
            style={toDoTask.checked_control ? toDoCardsStyleDone : toDoCardsStyleNotFinished}
          >
            <h5 className="card-title">{toDoTask.content_title}</h5>
            <p className="card-text">{toDoTask.content}</p>
          </div>

          {showForm && (
            <div id="update-task-form">
              <form onSubmit={handleUpdateFormSubmit}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={newTask.title}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="content_title"
                    value={newTask.content_title}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="content"
                    value={newTask.content}
                    onChange={handleUpdateInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          )}

        </div>
      </>
    );
  };
  
  export default ToDoCard;
