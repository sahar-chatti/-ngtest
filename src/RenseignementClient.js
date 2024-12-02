import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import BASE_URL from './constantes';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

const FormContainer = styled.div`
  width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary && `
    background: #4299e1;
    color: white;
    border: none;
    &:hover { background: #3182ce; }
  `}
  
  ${props => props.secondary && `
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    &:hover { background: #f7fafc; }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ProspectionForm = () => {
  const user = useSelector((state) => state.user);
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    DATE_CREATION: today,
    CLIENT: '',
    COMMERCIAL: user?.LOGIN || '',
    UTILISATEUR: user?.LOGIN || '',
    STATUT: 'EN_COURS',
    AVIS_COMERCIAL: '',
    ENCOURS_COMMERCIAL: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/api/prospection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Prospection créée avec succès!');
        // Reset form
        setFormData({
          ...formData,
          CLIENT: '',
          AVIS_COMERCIAL: '',
          ENCOURS_COMMERCIAL: ''
        });
      } else {
        toast.error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
      console.error('Error:', error);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Demande Renseignement Client</FormTitle>
      <form onSubmit={handleSubmit}>
        <InputGrid>
          <InputGroup>
            <Label>Date Demande</Label>
            <Input
              type="date"
              name="DATE_CREATION"
              value={formData.DATE_CREATION}
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </InputGroup>

          <InputGroup>
            <Label>Commercial</Label>
            <Input
              type="text"
              name="COMMERCIAL"
              value={formData.COMMERCIAL}
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </InputGroup>

          <InputGroup>
            <Label>Client</Label>
            <Input
              type="text"
              name="CLIENT"
              value={formData.CLIENT}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Avis Commercial</Label>
            <Input
              type="text"
              name="AVIS_COMERCIAL"
              value={formData.AVIS_COMERCIAL}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Encours Commercial</Label>
            <Input
              type="text"
              name="ENCOURS_COMMERCIAL"
              value={formData.ENCOURS_COMMERCIAL}
              onChange={handleChange}
            />
          </InputGroup>
        </InputGrid>

        <ButtonGroup>
          <Button 
            type="button" 
            secondary 
            onClick={() => setFormData({
              ...formData,
              CLIENT: '',
              AVIS_COMERCIAL: '',
              ENCOURS_COMMERCIAL: ''
            })}
          >
            Annuler
          </Button>
          <Button type="submit" primary>
            Enregistrer
          </Button>
        </ButtonGroup>
      </form>
      <ToastContainer />
    </FormContainer>
  );
};

export default ProspectionForm;
