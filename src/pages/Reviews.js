import axios from 'axios';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import styles from '../styles/Reviews.module.css';

export default function ReviewsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://carbookingbackend-df57468af270.herokuapp.com/reviews/',
        {
          headers: { 
            Authorization: `Token ${user?.token}`
          },
          params: {
            ordering: '-created_at'
          }
        }
      );
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data || 'Failed to load reviews');
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to submit a review');
      navigate('/signin', { 
        state: { 
          from: '/reviews',
          message: 'Please sign in to submit a review'
        } 
      });
      return;
    }

    try {
      if (editMode) {
        await axios.put(
          `https://carbookingbackend-df57468af270.herokuapp.com/reviews/${formData.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Review updated successfully!');
      } else {
        await axios.post(
          'https://carbookingbackend-df57468af270.herokuapp.com/reviews/',
          formData,
          {
            headers: {
              Authorization: `Token ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Review submitted successfully!');
      }
      
      resetForm();
      fetchReviews();
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data || 'Operation failed');
    }
  };

  const handleEdit = (review) => {
    setFormData({
      id: review.id,
      rating: review.rating,
      comment: review.comment
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(
          `https://carbookingbackend-df57468af270.herokuapp.com/reviews/${id}/`,
          {
            headers: { Authorization: `Token ${user.token}` }
          }
        );
        setSuccess('Review deleted successfully!');
        fetchReviews();
      } catch (err) {
        setError(err.response?.data || 'Failed to delete review');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      rating: 5,
      comment: ''
    });
    setEditMode(false);
    setError(null);
  };

  const isReviewOwner = (reviewUserId) => {
    return user && user.user && reviewUserId === user.user.id;
  };

  const StarRating = ({ rating }) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={star <= rating ? styles.filledStar : styles.emptyStar}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={styles.reviewsContainer}>
      <h1>Customer Reviews</h1>
      
      {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}
      {error && <div className={`${styles.alert} ${styles.error}`}>{JSON.stringify(error)}</div>}
      
      <div className={styles.formSection}>
        <h2>{editMode ? 'Edit Your Review' : 'Write a Review'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Rating (1-5):</label>
            <div className={styles.ratingInput}>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                required
              />
              <StarRating rating={formData.rating} />
            </div>
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
      
      <div className={styles.listSection}>
        <h2>Customer Feedback</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to share your experience!</p>
        ) : (
          <>
            <div className={styles.reviewsList}>
              {currentReviews.map((review, index) => (
                <div key={`${review.id}-${index}`} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.ratingContainer}>
                      <span className={styles.ratingNumber}>{review.rating}/5</span>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className={styles.comment}>{review.comment}</p>
                  <div className={styles.reviewFooter}>
                    <small>
                      Posted by {review.user_full_name || 'Customer'} on {new Date(review.created_at).toLocaleDateString()}
                    </small>
                    {isReviewOwner(review.user) && (
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
            
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  &laquo; Previous
                </button>
                
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages} | 
                  Showing {currentReviews.length} reviews
                </span>
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}