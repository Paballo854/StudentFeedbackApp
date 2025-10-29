import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Use environment variable for API URL or default to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(API_URL + '/feedback');
      setFeedbacks(response.data.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    
    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }
    
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await axios.post(API_URL + '/feedback', formData);
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: 5
      });
      setShowForm(false);
      setErrors({});
      fetchFeedbacks();
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(API_URL + '/feedback/' + id);
        fetchFeedbacks();
        alert('Feedback deleted successfully!');
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback. Please try again.');
      }
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>Student Feedback System</h1>
          <p>Share your learning experience and help us improve</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <button 
            className={'nav-btn ' + (!showForm ? 'active' : '')}
            onClick={() => setShowForm(false)}
          >
            View Feedback
          </button>
          <button 
            className={'nav-btn ' + (showForm ? 'active' : '')}
            onClick={() => setShowForm(true)}
          >
            Submit Feedback
          </button>
        </div>
      </nav>

      <main className="container">
        {showForm ? (
          <div className="feedback-form-section">
            <h2>Submit Course Feedback</h2>
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="studentName">Student Name *</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className={errors.studentName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.studentName && <span className="error-text">{errors.studentName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="courseCode">Course Code *</label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className={errors.courseCode ? 'error' : ''}
                  placeholder="e.g., BIWA2110"
                />
                {errors.courseCode && <span className="error-text">{errors.courseCode}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="comments">Comments *</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className={errors.comments ? 'error' : ''}
                  placeholder="Share your thoughts about the course..."
                  rows="4"
                />
                {errors.comments && <span className="error-text">{errors.comments}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating *</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className={errors.rating ? 'error' : ''}
                >
                  <option value="5">★★★★★ (5) - Excellent</option>
                  <option value="4">★★★★☆ (4) - Very Good</option>
                  <option value="3">★★★☆☆ (3) - Good</option>
                  <option value="2">★★☆☆☆ (2) - Fair</option>
                  <option value="1">★☆☆☆☆ (1) - Poor</option>
                </select>
                {errors.rating && <span className="error-text">{errors.rating}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Feedback
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="dashboard-section">
            <div className="dashboard-header">
              <h2>Course Feedback Dashboard</h2>
              <div className="stats">
                <div className="stat-card">
                  <h3>{feedbacks.length}</h3>
                  <p>Total Feedback</p>
                </div>
                <div className="stat-card">
                  <h3>
                    {feedbacks.length > 0 
                      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
                      : '0.0'
                    }
                  </h3>
                  <p>Average Rating</p>
                </div>
              </div>
            </div>

            {feedbacks.length === 0 ? (
              <div className="no-feedback">
                <h3>No feedback submitted yet</h3>
                <p>Be the first to share your course experience!</p>
                <button 
                  className="primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  Submit First Feedback
                </button>
              </div>
            ) : (
              <div className="feedback-grid">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                      <h3>{feedback.courseCode}</h3>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(feedback.id)}
                        title="Delete feedback"
                      >
                        ×
                      </button>
                    </div>
                    <div className="rating">
                      <span className="stars">{getRatingStars(feedback.rating)}</span>
                      <span className="rating-number">({feedback.rating}/5)</span>
                    </div>
                    <p className="comments">"{feedback.comments}"</p>
                    <div className="feedback-footer">
                      <span className="student-name">— {feedback.studentName}</span>
                      <span className="date">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Student Feedback System</h3>
              <p>Limkokwing University of Creative Technology</p>
              <p>Faculty of Information & Communication Technology</p>
            </div>
            <div className="footer-section">
              <h4>Course Information</h4>
              <p>BIWA2110 - Web Application Development</p>
              <p>BSc. in Information Technology</p>
              <p>Semester 1 - 2024</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Limkokwing University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
// dummy change 
