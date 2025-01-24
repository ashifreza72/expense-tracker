import { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboardstyle from '../styles/Dashboardstyle.css';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Expense');
  const [description, setDescription] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const addExpense = async () => {
    try {
      const userId = 1; // Replace with actual user ID once authentication is implemented
      await axios.post('http://localhost:5000/api/expenses', {
        amount,
        category,
        description,
        user_id: userId,
      });
      fetchExpenses();
      setAmount('');
      setCategory('Expense');
      setDescription('');
      showSuccessDialog(
        `${category === 'Income' ? 'Income' : 'Expense'} added successfully!`
      );
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/expenses/delete/${deleteId}`
      );
      fetchExpenses();
      setShowConfirmDialog(false);
      showSuccessDialog('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const showSuccessDialog = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 3000); // Hide after 3 seconds
  };

  // Calculate total income and total expenses
  const totalIncome = expenses
    .filter((expense) => expense.category === 'Income')
    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const totalExpenses = expenses
    .filter((expense) => expense.category === 'Expense')
    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Function to export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Expense Report', 14, 15);

    // Table Header & Data (No 'id' field included)
    const tableColumn = ['Amount', 'Category', 'Description', 'Date'];
    const tableRows = expenses.map((expense) => [
      `₹${expense.amount}`, // Amount
      expense.category, // Category
      expense.description, // Description
      expense.created_at
        ? new Date(expense.created_at).toLocaleDateString('en-GB') // Date formatted as DD/MM/YYYY
        : 'No Date', // Default value if date is missing
    ]);

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    // Add financial summary after the table
    const summaryY = doc.lastAutoTable.finalY + 10; // Position after the table

    doc.setFontSize(12);
    doc.text(`Total Income: ₹${totalIncome}`, 14, summaryY);
    doc.text(`Total Expenses: ₹${totalExpenses}`, 14, summaryY + 7);
    doc.text(`Net Balance: ₹${totalIncome - totalExpenses}`, 14, summaryY + 14);

    // Save the PDF
    doc.save('Expense_Report.pdf');
  };

  return (
    <div className='dashboard-container'>
      <header className='dashboard-header'>
        <h1>Expense Tracker Dashboard</h1>
        <nav>
          <button onClick={() => navigate('/')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </nav>
      </header>
      <main className='dashboard-main'>
        <section className='expense-form'>
          <h2>Add {category}</h2>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='category-label'>Category</InputLabel>
                <Select
                  labelId='category-label'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value='Income'>Income</MenuItem>
                  <MenuItem value='Expense'>Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant='contained'
                color={category === 'Income' ? 'success' : 'primary'}
                onClick={addExpense}
              >
                Add {category}
              </Button>
            </Grid>
          </Grid>
        </section>

        {/* Summary of Income and Expenses */}
        <div className='bg-gray-100 p-6 rounded-lg shadow-md mt-6 text-center'>
          <h3 className='text-xl font-semibold mb-4 text-gray-700'>
            Financial Summary
          </h3>
          <div className='flex justify-around'>
            <p className='text-green-600 font-bold text-lg'>
              Total Income: ₹{totalIncome}
            </p>
            <p className='text-red-600 font-bold text-lg'>
              Total Expenses: ₹{totalExpenses}
            </p>
            <p
              className={`text-lg font-bold ${
                totalIncome - totalExpenses >= 0
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              Net Balance: ₹{totalIncome - totalExpenses}
            </p>
          </div>
        </div>

        {/* Export to PDF Button */}
        <button
          style={{
            backgroundColor: 'green', // Tailwind's blue-600 equivalent
            color: '#FFFFFF', // White text
            padding: '8px 16px', // Spacing for 'p-2'
            borderRadius: '4px', // Rounded corners
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Shadow
            marginTop: '16px', // Margin-top equivalent to 'mt-4'
            border: 'none', // Remove default border
            cursor: 'pointer', // Pointer cursor on hover
          }}
          onClick={exportToPDF}
        >
          Export to PDF
        </button>

        <section className='expense-list'>
          <h2>Expense List</h2>
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>
                    {expense.created_at
                      ? new Date(expense.created_at).toISOString().split('T')[0] // Extract only the date (YYYY-MM-DD)
                      : 'No Date'}
                  </td>
                  <td>
                    <IconButton
                      onClick={() => confirmDelete(expense.id)}
                      aria-label='delete'
                      sx={{ color: 'red' }} // Sets the color of the icon
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Success Dialog Box */}
      {showDialog && (
        <div className='dialog-box success'>
          <p>{dialogMessage}</p>
        </div>
      )}

      {/* Confirmation Dialog Box */}
      {showConfirmDialog && (
        <div className='dialog-box confirm'>
          <p>Are you sure you want to delete this expense?</p>
          <div className='dialog-buttons'>
            <button onClick={handleDelete} className='confirm-btn'>
              Yes
            </button>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className='cancel-btn'
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
