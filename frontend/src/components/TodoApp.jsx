import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Create todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title,
        description,
        completed: false,
      });
      setTodos([response.data, ...todos]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle complete status
  const toggleComplete = async (id, completed) => {
    const todo = todos.find((t) => t._id === id);
    await updateTodo(id, { ...todo, completed: !completed });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        padding: "30px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "30px",
          fontSize: "2.5em",
        }}
      >
        Todo App
      </h1>

      {/* Create Todo Form */}
      <form
        onSubmit={createTodo}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "5px",
            outline: "none",
          }}
          required
        />
        <textarea
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "5px",
            outline: "none",
            resize: "vertical",
            minHeight: "80px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#764ba2")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#667eea")}
        >
          Add Todo
        </button>
      </form>

      {/* Todo List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {todos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            No todos yet. Create one!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "5px",
                border: `2px solid ${todo.completed ? "#4caf50" : "#e0e0e0"}`,
                transition: "all 0.3s",
              }}
            >
              {editingId === todo._id ? (
                // Edit mode
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "5px",
                    }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "5px",
                      resize: "vertical",
                    }}
                    rows="2"
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        updateTodo(todo._id, {
                          title: editTitle,
                          description: editDescription,
                          completed: todo.completed,
                        })
                      }
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#999",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo._id, todo.completed)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    />
                    <h3
                      style={{
                        flex: 1,
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                        color: todo.completed ? "#999" : "#333",
                      }}
                    >
                      {todo.title}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditTitle(todo.title);
                        setEditDescription(todo.description || "");
                      }}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ffc107",
                        color: "#333",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {todo.description && (
                    <p
                      style={{
                        marginLeft: "35px",
                        color: "#666",
                        fontStyle: todo.completed ? "italic" : "normal",
                      }}
                    >
                      {todo.description}
                    </p>
                  )}
                  <small
                    style={{
                      marginLeft: "35px",
                      color: "#999",
                      display: "block",
                      marginTop: "5px",
                    }}
                  >
                    Created: {new Date(todo.createdAt).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoApp;
