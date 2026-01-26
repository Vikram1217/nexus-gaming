// Footer.jsx
import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Nexus <span>Gaming</span></h3>
          <p>Your ultimate destination for tracking and reviewing the games you love.</p>
        </div>

        <div className="footer-section credits">
          <p>Data provided by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG.io API <ExternalLink size={14}/></a></p>
          <p>© {new Date().getFullYear()} Nexus Gaming Project</p>
        </div>

        <div className="footer-section socials">
          <Mail size={20} className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;