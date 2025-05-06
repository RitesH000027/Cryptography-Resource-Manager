import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const CryptoIIITDDashboard = () => {
  const { user } = useAuth();
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form states
  const [showProfessorForm, setShowProfessorForm] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);
  
  // Professor form state
  const [professorForm, setProfessorForm] = useState({
    name: '',
    title: '',
    specialization: '',
    bio: '',
    website_url: '',
    email: '',
    image: null,
    imagePreview: null
  });
  
  // Project states
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    type: 'IP',
    description: '', // Add this line
    startDate: '',
    endDate: '',
    status: 'ongoing',
    members: [''],
    professorId: ''
  });

  // Fetch professors on component mount
  useEffect(() => {
    fetchProfessors();
  }, []);
  
  // Fetch professors
  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/professors');
      setProfessors(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching professors:', err);
      setError('Failed to load professors. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle professor form input change
  const handleProfessorInputChange = (e) => {
    const { name, value } = e.target;
    setProfessorForm({
      ...professorForm,
      [name]: value
    });
  };
  
  // Handle professor image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfessorForm({
        ...professorForm,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  
  // Reset professor form
  const resetProfessorForm = () => {
    setProfessorForm({
      name: '',
      title: '',
      specialization: '',
      bio: '',
      website_url: '',
      email: '',
      image: null,
      imagePreview: null
    });
    setEditingProfessor(null);
  };
  
  // Open professor form for adding
  const openAddProfessorForm = () => {
    resetProfessorForm();
    setShowProfessorForm(true);
  };
  
  // Open professor form for editing
  const openEditProfessorForm = (professor) => {
    setProfessorForm({
      name: professor.name,
      title: professor.title || '',
      specialization: professor.specialization || '',
      bio: professor.bio || '',
      website_url: professor.website_url || '',
      email: professor.email || '',
      image: null,
      imagePreview: professor.image_url
    });
    setEditingProfessor(professor);
    setShowProfessorForm(true);
  };
  
  // Submit professor form
  const handleProfessorSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', professorForm.name);
      formData.append('title', professorForm.title);
      formData.append('specialization', professorForm.specialization);
      formData.append('bio', professorForm.bio);
      formData.append('website_url', professorForm.website_url);
      formData.append('email', professorForm.email);
      
      if (professorForm.image) {
        formData.append('image', professorForm.image);
      }
      
      if (editingProfessor) {
        // Update existing professor
        await axios.put(`/api/professors/${editingProfessor.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Professor updated successfully!');
      } else {
        // Add new professor
        await axios.post('/api/professors', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Professor added successfully!');
      }
      
      // Refresh professors list
      fetchProfessors();
      
      // Reset form and close modal
      resetProfessorForm();
      setShowProfessorForm(false);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving professor:', err);
      setError('Failed to save professor. Please try again.');
      setLoading(false);
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Delete professor
  const handleDeleteProfessor = async (professorId) => {
    if (window.confirm('Are you sure you want to delete this professor? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        await axios.delete(`/api/professors/${professorId}`);
        
        setSuccess('Professor deleted successfully!');
        
        // Refresh professors list
        fetchProfessors();
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting professor:', err);
        setError('Failed to delete professor. Please try again.');
        setLoading(false);
        
        // Clear error message after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Project handlers
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...projectForm.members];
    newMembers[index] = value;
    setProjectForm(prev => ({
      ...prev,
      members: newMembers
    }));
  };

  const addMember = () => {
    setProjectForm(prev => ({
      ...prev,
      members: [...prev.members, '']
    }));
  };

  const removeMember = (index) => {
    setProjectForm(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      type: 'IP',
      description: '', // Add this line
      startDate: '',
      endDate: '',
      status: 'ongoing',
      members: [''],
      professorId: ''
    });
    setEditingProject(null);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement project submission logic
    setShowProjectForm(false);
    resetProjectForm();
  };

  return (
    <Container>
      <Header>
        <h2>Manage Professors</h2>
        <AddButton onClick={openAddProfessorForm}>
          <FaPlus /> Add Professor
        </AddButton>
      </Header>
      
      {error && (
        <Alert type="error">
          <FaExclamationTriangle /> {error}
        </Alert>
      )}
      
      {success && (
        <Alert type="success">
          <FaCheck /> {success}
        </Alert>
      )}
      
      {loading && !showProfessorForm ? (
        <LoadingContainer>
          <FaSpinner className="spinner" />
          <p>Loading professors...</p>
        </LoadingContainer>
      ) : professors.length === 0 ? (
        <EmptyState>
          <p>No professors found. Add your first professor to get started.</p>
        </EmptyState>
      ) : (
        <ProfessorsList>
          {professors.map(professor => (
            <ProfessorCard key={professor.id}>
              <ProfessorHeader>
                <ProfessorImage 
                  src={professor.image_url || '/default-professor.png'} 
                  alt={professor.name} 
                />
                <ProfessorInfo>
                  <ProfessorName>{professor.name}</ProfessorName>
                  <ProfessorTitle>{professor.title}</ProfessorTitle>
                </ProfessorInfo>
              </ProfessorHeader>
              
              <ProfessorActions>
                <ActionButton onClick={() => openEditProfessorForm(professor)}>
                  <FaEdit /> Edit
                </ActionButton>
                <ActionButton danger onClick={() => handleDeleteProfessor(professor.id)}>
                  <FaTrash /> Delete
                </ActionButton>
              </ProfessorActions>
            </ProfessorCard>
          ))}
        </ProfessorsList>
      )}
      
      {/* Professor Form Modal */}
      {showProfessorForm && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>{editingProfessor ? 'Edit Professor' : 'Add New Professor'}</h3>
              <CloseButton onClick={() => setShowProfessorForm(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleProfessorSubmit}>
              <FormGroup>
                <Label htmlFor="name">Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={professorForm.name}
                  onChange={handleProfessorInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={professorForm.title}
                  onChange={handleProfessorInputChange}
                  placeholder="e.g. Associate Professor"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={professorForm.specialization}
                  onChange={handleProfessorInputChange}
                  placeholder="e.g. Cryptography, Network Security"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={professorForm.bio}
                  onChange={handleProfessorInputChange}
                  rows="4"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  type="url"
                  id="website_url"
                  name="website_url"
                  value={professorForm.website_url}
                  onChange={handleProfessorInputChange}
                  placeholder="https://example.com"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={professorForm.email}
                  onChange={handleProfessorInputChange}
                  placeholder="professor@example.com"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="image">Profile Image</Label>
                <FileInput
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {(professorForm.imagePreview || editingProfessor?.image_url) && (
                  <ImagePreview>
                    <img 
                      src={professorForm.imagePreview || editingProfessor?.image_url} 
                      alt="Preview" 
                    />
                  </ImagePreview>
                )}
              </FormGroup>
              
              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowProfessorForm(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? <FaSpinner className="spinner" /> : null}
                  {editingProfessor ? 'Update Professor' : 'Add Professor'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Projects Section */}
      <Section>
        <Header>
          <h2>Manage Projects</h2>
          <AddButton onClick={() => setShowProjectForm(true)}>
            <FaPlus /> Add Project
          </AddButton>
        </Header>

        {/* Project Form Modal */}
        {showProjectForm && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                <CloseButton onClick={() => setShowProjectForm(false)}>×</CloseButton>
              </ModalHeader>

              <Form onSubmit={handleProjectSubmit}>
                <FormGroup>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Project Type *</Label>
                  <Select
                    id="type"
                    name="type"
                    value={projectForm.type}
                    onChange={handleProjectInputChange}
                    required
                  >
                    <option value="IP">IP</option>
                    <option value="IS">IS</option>
                    <option value="BTP">BTP</option>
                    <option value="Capstone">Capstone</option>
                    <option value="Thesis">Thesis</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectInputChange}
                    rows="4"
                    placeholder="Enter project description..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Project Duration</Label>
                  <DateContainer>
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={projectForm.startDate}
                        onChange={handleProjectInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={projectForm.endDate}
                        onChange={handleProjectInputChange}
                        disabled={projectForm.status === 'ongoing'}
                      />
                    </div>
                  </DateContainer>
                  <StatusContainer>
                    <Label>Project Status</Label>
                    <RadioGroup>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="status"
                          value="ongoing"
                          checked={projectForm.status === 'ongoing'}
                          onChange={handleProjectInputChange}
                        />
                        Ongoing
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="status"
                          value="completed"
                          checked={projectForm.status === 'completed'}
                          onChange={handleProjectInputChange}
                        />
                        Completed
                      </RadioLabel>
                    </RadioGroup>
                  </StatusContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Project Members</Label>
                  {projectForm.members.map((member, index) => (
                    <MemberInputContainer key={index}>
                      <Input
                        type="text"
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder="Enter member name"
                      />
                      {index > 0 && (
                        <RemoveButton type="button" onClick={() => removeMember(index)}>
                          <FaTrash />
                        </RemoveButton>
                      )}
                    </MemberInputContainer>
                  ))}
                  <AddMemberButton type="button" onClick={addMember}>
                    <FaPlus /> Add Member
                  </AddMemberButton>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="professorId">Professor/Guide *</Label>
                  <Select
                    id="professorId"
                    name="professorId"
                    value={projectForm.professorId}
                    onChange={handleProjectInputChange}
                    required
                  >
                    <option value="">Select Professor</option>
                    {professors.map(professor => (
                      <option key={professor.id} value={professor.id}>
                        {professor.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <ButtonGroup>
                  <CancelButton type="button" onClick={() => setShowProjectForm(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </SubmitButton>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
  
  background-color: ${({ type, theme }) => 
    type === 'error' ? '#FEE8E7' : 
    type === 'success' ? '#E6F4EA' : 
    theme.colors.primaryLight};
  
  color: ${({ type }) => 
    type === 'error' ? '#D93025' : 
    type === 'success' ? '#34A853' : 
    '#1A73E8'};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  
  .spinner {
    font-size: 1.5rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    margin-top: 1rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #F8F9FA;
  border-radius: 8px;
  
  p {
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const ProfessorsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProfessorCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProfessorHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfessorImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.primaryLight};
`;

const ProfessorInfo = styled.div`
  flex: 1;
`;

const ProfessorName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProfessorTitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ProfessorActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  background-color: ${({ danger, theme }) => 
    danger ? '#FEE8E7' : theme.colors.primaryLight};
  color: ${({ danger, theme }) => 
    danger ? '#D93025' : theme.colors.primary};
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ danger, theme }) => 
      danger ? '#FDCCCB' : theme.colors.primaryLighter};
  }
  
  svg {
    font-size: 0.8rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.5rem 0;
`;

const ImagePreview = styled.div`
  margin-top: 0.5rem;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const CheckboxContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MemberInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  padding: 0.75rem;
  background-color: #FEE8E7;
  color: #D93025;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #FDCCCB;
  }
`;

const AddMemberButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLighter};
  }
`;

const StatusContainer = styled.div`
  margin-top: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="radio"] {
    cursor: pointer;
  }
`;

export default CryptoIIITDDashboard;