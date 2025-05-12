import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks'; // Replace you deploy URL

const getAllTasks = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

export default taskService;