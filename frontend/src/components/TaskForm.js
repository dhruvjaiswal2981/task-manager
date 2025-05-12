import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  Delete,
  ArrowBack,
  CalendarToday,
  Description,
  Title as TitleIcon,
  Work
} from '@mui/icons-material';
import taskService from '../services/taskService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: null,
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const data = await taskService.getTaskById(id);
          setTask({
            ...data,
            dueDate: data.dueDate ? dayjs(data.dueDate) : null
          });
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null
      };

      if (id) {
        await taskService.updateTask(id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main
          }}
        >
          {id ? 'Edit Task' : 'Create New Task'}
        </Typography>
      </Box>

      <Card 
        sx={{ 
          boxShadow: theme.shadows[3],
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <TitleIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.shape.borderRadius,
                    }
                  }}
                />
              </Grid>
              
              {/* Description Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Description color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.shape.borderRadius,
                    }
                  }}
                />
              </Grid>
              
              {/* Due Date Field */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date"
                    value={task.dueDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        InputProps={{
                          startAdornment: (
                            <CalendarToday color="action" sx={{ mr: 1 }} />
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: theme.shape.borderRadius,
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Status Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={task.status}
                    label="Status"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius,
                      }
                    }}
                    startAdornment={
                      <Work color="action" sx={{ mr: 1 }} />
                    }
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box 
                  display="flex" 
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    {id && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDelete}
                        sx={{ mr: 2 }}
                      >
                        Delete Task
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    sx={{
                      px: 4,
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 'bold'
                    }}
                  >
                    {id ? 'Update Task' : 'Create Task'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskForm;