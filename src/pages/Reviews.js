import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from '../styles/Reviews.module.css';

export default function ReviewsPage() {
  // State management
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // For edit mode
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch reviews
      const response = await axios.get(
        'https://carbookingbackend-df57468af270.herokuapp.com/reviews/',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to load reviews');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem('token'); // Retrieve token
    console.log("Token before submission:", token);
    if (!token) {
        setError('Authentication required. Please log in.'); // Handle missing token
        return; // Exit early if token is not available
    }

    try {
        if (editMode) {
            // Update existing review
            await axios.put(
                `https://carbookingbackend-df57468af270.herokuapp.com/reviews/${formData.id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSuccess('Review updated successfully!'); // Success message after update
        } else {
            // Create new review
            await axios.post(
                'https://carbookingbackend-df57468af270.herokuapp.com/reviews/',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Ensure token is here
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSuccess('Review submitted successfully!'); // Success message after creation
        }
        
        resetForm(); // Reset form data after successful submission
        fetchReviews(); // Refresh reviews
    } catch (err) {
        setError(err.response?.data || 'Operation failed'); // Error handling
    }
};

  // Set form for editing
  const handleEdit = (review) => {
    setFormData({
      id: review.id,
      rating: review.rating,
      comment: review.comment
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a review
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `https://carbookingbackend-df57468af270.herokuapp.com/reviews/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccess('Review deleted successfully!');
        fetchReviews();
      } catch (err) {
        setError(err.response?.data || 'Failed to delete review');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      rating: 5,
      comment: ''
    });
    setEditMode(false);
    setError(null);
  };

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={styles.reviewsContainer}>
      <h1>Customer Reviews</h1>
      
      {/* Success/Error Messages */}
      {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}
      {error && <div className={`${styles.alert} ${styles.error}`}>{JSON.stringify(error)}</div>}
      
      {/* Review Form */}
      <div className={styles.formSection}>
        <h2>{editMode ? 'Edit Your Review' : 'Write a Review'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Rating (1-5):</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Your Feedback:</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your experience with our rental service..."
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={`${styles.btn} ${styles.primary}`}>
              {editMode ? 'Update Review' : 'Submit Review'}
            </button>
            {editMode && (
              <button type="button" className={`${styles.btn} ${styles.secondary}`} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Reviews List */}
      <div className={styles.listSection}>
        <h2>Customer Feedback</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to share your experience!</p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.rating}>
                    Rating: {review.rating}/5
                  </div>
                </div>
                <p className={styles.comment}>{review.comment}</p>
                <div className={styles.reviewFooter}>
                  <small>
                    Posted by Customer on {new Date(review.created_at).toLocaleDateString()}
                  </small>
                  {review.user === parseInt(localStorage.getItem('userId')) && (
                    <div className={styles.actions}>
                      <button 
                        className={`${styles.btn} ${styles.edit}`}
                        onClick={() => handleEdit(review)}
                      >
                        Edit
                      </button>
                      <button 
                        className={`${styles.btn} ${styles.delete}`}
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}