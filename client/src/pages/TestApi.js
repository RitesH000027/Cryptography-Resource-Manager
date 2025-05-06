import React, { useState } from 'react';
import styled from 'styled-components';
import { testRegistration, testLogin } from '../utils/apiTest';

const TestApi = () => {
  const [testResults, setTestResults] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await testRegistration(formData);
      setTestResults(result);
    } catch (error) {
      setTestResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await testLogin({
        email: formData.email,
        password: formData.password
      });
      setTestResults(result);
    } catch (error) {
      setTestResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>API Test Page</h1>
      <p>Use this page to test backend API endpoints directly</p>
      
      <Form>
        <FormGroup>
          <Label>First Name</Label>
          <Input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter first name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Last Name</Label>
          <Input 
            type="text" 
            name="surname" 
            value={formData.surname} 
            onChange={handleChange} 
            placeholder="Enter last name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Password</Label>
          <Input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Enter password"
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button onClick={handleTestRegistration} disabled={isLoading}>
            Test Registration
          </Button>
          <Button onClick={handleTestLogin} disabled={isLoading}>
            Test Login
          </Button>
        </ButtonGroup>
      </Form>
      
      {isLoading && <p>Testing API...</p>}
      
      {testResults && (
        <ResultsContainer>
          <h2>Test Results</h2>
          <pre>{JSON.stringify(testResults, null, 2)}</pre>
        </ResultsContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #5649c0;
  }
  
  &:disabled {
    background: #b2b2b2;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  
  pre {
    background: #e9ecef;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
`;

export default TestApi;