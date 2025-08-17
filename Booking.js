import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Booking = () => {
  const { id } = useParams(); // hall ID from URL
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [form, setForm] = useState({
    userName: '',
    date: '',
    time: ''
  });
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    // Fetch hall details by ID
    axios.get(`http://localhost:5000/api/halls/${id}`)
      .then(res => {
        setHall(res.data); // Set the specific hall data
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load hall details.');
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to complete the booking.");
      navigate("/login");
      return;
    }

    try {
      // Sending booking details to backend
      const response = await axios.post('http://localhost:5000/api/bookings', {
        ...form,
        hallId: id // include hall ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Booking successful:', response.data);
      alert('Booking successful!');
      navigate('/'); // Redirect to home or another page after success
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Booking failed! Please try again.');
    }
  };

  if (!hall) {
    return <div>Loading hall details...</div>;
  }

  return (
    <div>
      <h1>Booking: {hall.name}</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>User Name:</label>
        <input 
          type="text" 
          value={form.userName} 
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          required 
        />
        
        <label>Booking Date:</label>
        <input 
          type="date" 
          value={form.date} 
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required 
        />
        
        <label>Booking Time:</label>
        <input 
          type="time" 
          value={form.time} 
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required 
        />
        
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default Booking;
