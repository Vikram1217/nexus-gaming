import React from 'react';
import { Link } from 'react-router-dom';
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

      {/* We will add Phase 3 (Features) after you style this! */}
    </div>
  );
};