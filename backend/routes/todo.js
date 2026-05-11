import express from "express";
import * as crypto from "node:crypto";
import Todo from "../models/Todo.js";

const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

// get a single todo
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new todo
router.post("/", async (req, res) => {
  const { title, description, completed } = req.body;
  const newTodo = new Todo({
    title,
    description,
    completed,
  });
  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true },
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    } else {
      res.json(updatedTodo);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    } else {
      res.json({ message: "Todo deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
