import React, { useState } from 'react';
import { Form, Button, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    if (!formData.termsAgreed) {
      setErrorMessage('You must agree to the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const requestData = {
        name: formData.name, // Add name field
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch('https://reqres.in/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Send the name, email, and password in the request body
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Signup successful!');
        setTimeout(() => {
          navigate('/dashboard'); // Navigate to the login page after successful signup
        }, 1500);
      } else {
        setErrorMessage(result.message || 'Signup failed');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="text-center mb-4">Sign Up</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        {/* Form Fields */}
        <Form.Group controlId="formName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

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

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="I agree to the Terms of Service and Privacy Policy"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" block disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
        </Button>

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Button variant="link" onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
