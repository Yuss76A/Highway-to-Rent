import axios from 'axios';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import styles from '../styles/Reviews.module.css';
import ConfirmationModal from './ConfirmationModal';

// API helper
const api = {
  getReviews: async (token, page) => {
    const config = token ? { headers: { Authorization: `Token ${token}` } } : {};
    return axios.get('https://carbookingbackend-df57468af270.herokuapp.com/reviews/', {
      ...config,
      params: { ordering: '-created_at', page },
    });
  },
  createReview: async (token, data) =>
    axios.post('https://carbookingbackend-df57468af270.herokuapp.com/reviews/', data, {
      headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
    }),
  updateReview: async (token, id, data) =>
    axios.put(`https://carbookingbackend-df57468af270.herokuapp.com/reviews/${id}/`, data, {
      headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
    }),
  deleteReview: async (token, id) =>
    axios.delete(`https://carbookingbackend-df57468af270.herokuapp.com/reviews/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    }),
};

export default function ReviewsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State management
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 8;
  const [formData, setFormData] = useState({ id: null, rating: 5, comment: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getReviews(user?.token, currentPage);
      setReviews(response.data.results);
      setTotalPages(Math.ceil(response.data.count / reviewsPerPage));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [currentPage, user?.token]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // Pagination function
  const paginate = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (value === '' ? '' : Math.max(1, Math.min(5, parseInt(value) || ''))) : value
    }));
  };

  const handleBlur = (e) => {
    if (e.target.name === 'rating' && formData.rating === '') {
      setFormData(prev => ({ ...prev, rating: 5 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin', { state: { from: '/reviews', message: 'Please sign in to submit a review' } });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess('');

      const submissionData = {
        ...formData,
        rating: Number(formData.rating)
      };

      if (editMode) {
        await api.updateReview(user.token, formData.id, submissionData);
        setSuccess('Review updated successfully!');
      } else {
        await api.createReview(user.token, submissionData);
        setSuccess('Review submitted successfully!');
      }
      
      resetForm();
      fetchReviews();
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = err.response.data;
        
        // Handle Django REST framework validation errors
        if (backendErrors.rating) {
          const ratingError = Array.isArray(backendErrors.rating) 
            ? backendErrors.rating[0] 
            : backendErrors.rating;
          setError(`Rating: ${ratingError}`);
        } 
        else if (backendErrors.comment) {
          const commentError = Array.isArray(backendErrors.comment) 
            ? backendErrors.comment[0] 
            : backendErrors.comment;
          setError(`Comment: ${commentError}`);
        } 
        else if (backendErrors.detail) {
          setError(backendErrors.detail);
        }
        else {
          setError('Please check your input and try again');
        }
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Review actions
  const handleEdit = (review) => {
    if (!user) return navigate('/signin');
    setFormData({ id: review.id, rating: review.rating, comment: review.comment });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (!user) return navigate('/signin');
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteReview(user.token, reviewToDelete);
      setSuccess('Review deleted successfully!');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete review');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Helpers
  const resetForm = () => {
    setFormData({ id: null, rating: 5, comment: '' });
    setEditMode(false);
    setError(null);
  };

  const isReviewOwner = (reviewUserId) => user?.user?.id === reviewUserId;

  const StarRating = ({ rating }) => (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? styles.filledStar : styles.emptyStar}>★</span>
      ))}
    </div>
  );

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={styles.reviewsContainer}>
      <h1>Customer Reviews</h1>

      {/* Alerts */}
      {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}
      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}

      {/* Review Form */}
      {user ? (
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
                  value={formData.rating || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <StarRating rating={Number(formData.rating) || 0} />
              </div>
              {error?.startsWith('Rating:') && (
                <span className={styles.fieldError}>
                  {error.replace('Rating:', '').trim()}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Your Feedback:</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Share your experience..."
                required
                minLength={1}
              />
              {error?.startsWith('Comment:') && (
                <span className={styles.fieldError}>
                  {error.replace('Comment:', '').trim()}
                </span>
              )}
            </div>
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={`${styles.btn} ${styles.primary}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : editMode ? 'Update' : 'Submit'}
              </button>
              {editMode && (
                <button type="button" className={`${styles.btn} ${styles.secondary}`} onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.signInPrompt}>
          <p>Want to share your experience?{' '}
            <button onClick={() => navigate('/signin')} className={styles.signInLink}>
              Sign in to leave a review
            </button>
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles.listSection}>
        <h2>Customer Feedback</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. {!user && 'Sign in to be the first to review!'}</p>
        ) : (
          <>
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.ratingContainer}>
                      <span className={styles.ratingNumber}>{review.rating}/5</span>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className={styles.comment}>{review.comment}</p>
                  <div className={styles.reviewFooter}>
                    <small>
                      Posted by {review.user_full_name || 'Customer'} on{' '}
                      {new Date(review.created_at).toLocaleDateString()}
                    </small>
                    {isReviewOwner(review.user) && (
                      <div className={styles.actions}>
                        <button className={`${styles.btn} ${styles.edit}`} onClick={() => handleEdit(review)}>
                          Edit
                        </button>
                        <button className={`${styles.btn} ${styles.delete}`} onClick={() => handleDeleteClick(review.id)}>
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
                  « Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  Next »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this review?"
        confirmText={deleting ? 'Deleting...' : 'Yes'}
        confirmDisabled={deleting}
      />
    </div>
  );
}
