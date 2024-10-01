import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import  '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),

      });


      const result = await response.json();

      console.log("+++++++++++++++++=============", result.token);
      

      if (response.status === 200) {
        localStorage.setItem('login', result.token );
        navigate('/dashboard');
      } else {
        setErrorMessage(result.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-center mb-4">Log In</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Log In'}
        </Button>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Button variant="link" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Login;
