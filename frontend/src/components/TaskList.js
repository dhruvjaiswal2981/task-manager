import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add, 
  Search, 
  FilterList,
  CalendarToday,
  CheckCircle,
  PendingActions,
  Autorenew
} from '@mui/icons-material';
import taskService from '../services/taskService';

const statusIcons = {
  pending: <PendingActions fontSize="small" />,
  'in-progress': <Autorenew fontSize="small" />,
  completed: <CheckCircle fontSize="small" />
};

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success'
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300); 
    
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const fetchTasks = async () => {
    try {
      let params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const data = await taskService.getAllTasks(params);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        My Tasks
      </Typography>
      
      {/* Search and Filter Card */}
      <Card 
        sx={{ 
          mb: 4, 
          boxShadow: theme.shadows[2],
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <CardContent>
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            {/* Search Field */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius,
                }
              }}
            />
            
            {/* Status Filter */}
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: 180,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            
            {/* Add Task Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/tasks/new')}
              fullWidth={window.innerWidth < 600}
              sx={{
                borderRadius: theme.shape.borderRadius,
                px: 3,
                py: 1,
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              New Task
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: theme.shadows[2],
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="tasks table">
          <TableHead sx={{ 
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.grey[800] 
              : theme.palette.primary.main 
          }}>
            <TableRow>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow 
                  key={task.id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {task.description || 'No description'}
                  </TableCell>
                  <TableCell>
                    <Box 
                      display="flex" 
                      alignItems="center"
                      gap={1}
                      sx={{ 
                        color: isOverdue(task.dueDate, task.status) 
                          ? theme.palette.error.main 
                          : 'inherit',
                        fontWeight: 'medium'
                      }}
                    >
                      <CalendarToday fontSize="small" />
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate, task.status) && (
                        <Chip 
                          label="Overdue" 
                          size="small" 
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcons[task.status]}
                      label={task.status.replace('-', ' ')}
                      color={statusColors[task.status]}
                      variant="outlined"
                      sx={{ 
                        textTransform: 'capitalize',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={() => navigate(`/tasks/${task.id}/edit`)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={() => handleDelete(task.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No tasks match your search criteria' 
                      : 'No tasks available. Create your first task!'}
                  </Typography>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => navigate('/tasks/new')}
                      sx={{ mt: 2 }}
                    >
                      Create Task
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskList;