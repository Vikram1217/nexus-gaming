import React from 'react'
import { useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReviewSection } from '../../components/ReviewSection/ReviewSection';
import './GameDetails.css';

const initialState = {
    game: null,
    loading: true,
    error: null 
  }

const gameReducer = (state, action) => {
    switch(action.type){
      case 'FETCH_START':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          loading: false,
          game: action.payload
        };
      case 'FETCH_ERROR':
        return state;
      default:
        return state;
    }

  }

const GameDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const fetchDetails = async() => {

      dispatch({type: 'FETCH_START' })
      
      try {
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        if(!response.ok){
          throw new Error('Could not find game details');
        }
        const data = await response.json();
        //Tell the reducer we successed and give it the data
        dispatch({type: 'FETCH_SUCCESS', payload: data})
      }catch (err){
        // Tell the reducer it failed
        dispatch({type: 'FETCH_ERROR', payload: err.message})
      }
    };

    fetchDetails();

  },[id, API_KEY])

  // 4. Destructure state for easier use in JSX
  const { game, loading, error } = state;

  if (loading) return <div className="loader">Gathering Intelligence...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      
      {game && (
        <>
          <div className="details-header" style={{ backgroundImage: `url(${game.background_image})` }}>
            <div className="header-overlay">
              <h1>{game.name}</h1>
            </div>
          </div>

          <div className="details-grid">
            <div className="details-main">
              <h2>About</h2>
              {/* RAWG description is HTML, so we use this specific React prop */}
              <div 
                className="description" 
                dangerouslySetInnerHTML={{ __html: game.description }} 
              />
            </div>

            <div className="details-sidebar">
              <div className="stat-box">
                <h4>Rating</h4>
                <p>{game.rating} / 5</p>
              </div>
              <div className="stat-box">
                <h4>Released</h4>
                <p>{game.released}</p>
              </div>
              <div className="genres">
                {game.genres?.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <ReviewSection gameId={id} />
    </div>
  );
}

export default GameDetails;
