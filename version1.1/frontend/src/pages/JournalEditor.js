import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  fetchJournalTags
} from '../redux/slices/journalSlice';
import './JournalEditor.css';

const JournalEditor = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEntry, tags, isLoading, error } = useSelector(state => state.journal);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood_rating: '',
    tags: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode] = useState(!!entryId);

  // Load entry data if in edit mode
  useEffect(() => {
    // Fetch tags for the dropdown
    dispatch(fetchJournalTags());
    
    if (isEditMode) {
      dispatch(fetchJournalEntry(entryId))
        .unwrap()
        .then(entry => {
          setFormData({
            title: entry.title || '',
            content: entry.content || '',
            mood_rating: entry.mood_rating || '',
            tags: entry.tags ? entry.tags.map(tag => tag.name) : []
          });
        })
        .catch(err => {
          console.error('Error loading journal entry:', err);
        });
    }
  }, [dispatch, entryId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleMoodChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      mood_rating: rating
    }));
  };

  const toggleTag = (tagName) => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      
      if (currentTags.includes(tagName)) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tagName)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagName]
        };
      }
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode) {
        // Update existing entry
        await dispatch(updateJournalEntry({
          entryId,
          entryData: formData
        })).unwrap();
        navigate(`/journal/${entryId}`);
      } else {
        // Create new entry
        const result = await dispatch(createJournalEntry(formData)).unwrap();
        navigate(`/journal/${result.id}`);
      }
    } catch (err) {
      console.error('Error saving journal entry:', err);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="journal-editor-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-editor-page">
      <div className="container">
        <div className="editor-header">
          <h1>{isEditMode ? 'Edit Journal Entry' : 'New Journal Entry'}</h1>
          <Link to={isEditMode ? `/journal/${entryId}` : '/journal'} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
        
        {error && (
          <div className="error-banner">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your entry a title"
              className={formErrors.title ? 'error' : ''}
            />
            {formErrors.title && <div className="error-message">{formErrors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your thoughts..."
              rows="12"
              className={formErrors.content ? 'error' : ''}
            ></textarea>
            {formErrors.content && <div className="error-message">{formErrors.content}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group mood-rating-group">
              <label>Mood Rating</label>
              <div className="mood-rating-selector">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`mood-rating-btn ${parseInt(formData.mood_rating) === rating ? 'active' : ''}`}
                    onClick={() => handleMoodChange(rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="mood-rating-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-selector">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-btn ${formData.tags.includes(tag.name) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <div className="tag-note">
              <small>Select tags that represent your entry's themes</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEditor; 