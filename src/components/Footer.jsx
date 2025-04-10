import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">
              © {new Date().getFullYear()} Todo App. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="/privacy" className="text-white text-decoration-none me-3">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white text-decoration-none">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 