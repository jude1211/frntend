import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:5000/api'

  // Configure axios defaults
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/todos')
      setTodos(response.data)
      setError('')
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await axiosInstance.post('/todos', {
        text: newTodo
      })
      setTodos([...todos, response.data])
      setNewTodo('')
      setError('')
    } catch (error) {
      console.error('Error adding todo:', error)
      setError('Failed to add todo')
    }
  }

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id)
      const response = await axiosInstance.put(`/todos/${id}`, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => t._id === id ? response.data : t))
      setError('')
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
  }

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditText(todo.text)
  }

  const cancelEditing = () => {
    setEditingTodo(null)
    setEditText('')
    setError('')
  }

  const handleEdit = async (e, id) => {
    e.preventDefault()
    
    if (!editText.trim()) {
      setError('Todo text cannot be empty')
      return
    }

    try {
      const todo = todos.find(t => t._id === id)
      if (!todo) {
        setError('Todo not found')
        return
      }

      const response = await axiosInstance.put(`/todos/${id}`, {
        text: editText.trim(),
        completed: todo.completed
      })

      if (response.data) {
        setTodos(prevTodos => 
          prevTodos.map(t => 
            t._id === id ? response.data : t
          )
        )
        setEditingTodo(null)
        setEditText('')
        setError('')
      } else {
        setError('Failed to update todo')
      }
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`)
      setTodos(todos.filter(todo => todo._id !== id))
      setError('')
    } catch (error) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo')
    }
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <h1 className="todo-header">Todo List</h1>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={addTodo} className="todo-form">
                <div className="todo-input-group">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo..."
                    className="todo-input"
                  />
                  <button type="submit" className="btn btn-primary">
                    Add Todo
                  </button>
                </div>
              </form>

              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="todo-list">
                  {todos.map(todo => (
                    <div key={todo._id} className="todo-item">
                      {editingTodo === todo._id ? (
                        <form 
                          className="edit-form" 
                          onSubmit={(e) => handleEdit(e, todo._id)}
                        >
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="form-control"
                            placeholder="Edit todo..."
                            autoFocus
                          />
                          <div className="edit-buttons">
                            <button 
                              type="submit" 
                              className="btn btn-success"
                            >
                              Save
                            </button>
                            <button 
                              type="button"
                              onClick={cancelEditing} 
                              className="btn btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="todo-content">
                          <span
                            className={`todo-text ${todo.completed ? 'completed' : ''}`}
                            onClick={() => toggleComplete(todo._id)}
                          >
                            {todo.text}
                          </span>
                          <div className="todo-actions">
                            <button
                              onClick={() => startEditing(todo)}
                              className="btn btn-warning btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTodo(todo._id)}
                              className="btn btn-danger btn-sm ms-2"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
