import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageSquare } from 'lucide-react';
import './Landing.css';

export const Landing = () => {
  return (
    <div className="landing-container">
      {/* SECTION 1: HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Ultimate <span className="highlight-text">Gaming Nexus</span>
          </h1>
          <p className="hero-subtitle">
            Discover millions of games, track your personal wishlist, and join a community of verified reviewers.
          </p>
          <div className="hero-btns">
            <Link to="/browse" className="cta-btn primary">Start Exploring</Link>
            <Link to="/login" className="cta-btn secondary">Join the Community</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="features">
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon"><Search size={48} color="#00ffcc" strokeWidth={1.5} /></div>
            <h3>Vast Discovery</h3>
            <p>Explore a database of over 500,000 games with real-time search and infinite scrolling technology.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Heart size={48} color='#00ffcc' strokeWidth={1.5} /></div>
            <h3>Personal Vault</h3>
            <p>Save your must-play titles to a private wishlist synced across all your devices via the cloud.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><MessageSquare size={48} color='#00ffcc' strokeWidth={1.5} /></div>
            <h3>Live Reviews</h3>
            <p>Share your opinions and see what the community is playing right now with our live activity feed.</p>
          </div>

        </div>
      </section>
    </div>
  );
};