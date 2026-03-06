import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h2 style={{ marginBottom: '10px' }}>Bir şeyler ters gitti.</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{ 
              textAlign: 'left', 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '6px',
              overflowX: 'auto',
              border: '1px solid #e9ecef'
            }}>
              <p style={{ color: '#dc3545', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                {this.state.error.toString()}
              </p>
              <pre style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
