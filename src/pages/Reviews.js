import axios from 'axios';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import styles from '../styles/Reviews.module.css';
import ConfirmationModal from './ConfirmationModal';

export default function ReviewsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State management
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
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const reviewsPerPage = 8;

  // Fetch reviews with pagination
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://carbookingbackend-df57468af270.herokuapp.com/reviews/',
        {
          headers: { 
            Authorization: `Token ${user?.token}`
          },
          params: {
            ordering: '-created_at',
            page: currentPage
          }
        }
      );
      setReviews(response.data.results);
      setTotalPages(Math.ceil(response.data.count / reviewsPerPage));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [user?.token, currentPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Pagination handler
  const paginate = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form handlers
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
      setError(err.response?.data?.detail || 'Operation failed');
    }
  };

  // Review actions
  const handleEdit = (review) => {
    if (!review?.id) {
      setError('Invalid review selected');
      return;
    }
    setFormData({
      id: review.id,
      rating: review.rating,
      comment: review.comment
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      setError('Invalid review selected');
      return;
    }
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(
        `https://carbookingbackend-df57468af270.herokuapp.com/reviews/${reviewToDelete}/`,
        {
          headers: { Authorization: `Token ${user.token}` }
        }
      );
      
      if (response.status === 204) {
        setSuccess('Review deleted successfully!');
        fetchReviews();
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Review not found - it may have been already deleted');
        fetchReviews();
      } else {
        setError(err.response?.data?.detail || 'Failed to delete review');
      }
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
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

  // Helper functions
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
      
      {/* Status messages */}
      {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}
      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
      
      {/* Review form */}
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
      
      {/* Reviews list */}
      <div className={styles.listSection}>
        <h2>Customer Feedback</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to share your experience!</p>
        ) : (
          <>
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={`review-${review.id}`} className={styles.reviewCard}>
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
                          onClick={() => handleDeleteClick(review.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination controls */}
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
                  Showing {reviews.length} reviews
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

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this review?"
        confirmText={deleting ? 'Deleting...' : 'Yes'}
        confirmDisabled={deleting}
      />
    </div>
  );
}