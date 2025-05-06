import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, 
  FiCalendar, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiFilter, 
  FiSearch,
  FiDownload,
  FiUpload
} from 'react-icons/fi';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [contentItems, setContentItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    type: 'article',
    content: '',
    fileUrl: '',
    date: '',
    tags: []
  });

  const fetchContentItems = useCallback(async () => {
    try {
      setLoading(true);
      
      let endpoint;
      if (activeTab === 'resources') {
        endpoint = '/api/resources';
      } else {
        endpoint = '/api/events';
      }
      
      const response = await axios.get(endpoint);
      setContentItems(response.data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load ${activeTab}`);
      setLoading(false);
      console.error(`Error fetching ${activeTab}:`, err);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchContentItems();
  }, [activeTab, fetchContentItems]);

  const handleOpenModal = (mode, item = null) => {
    if (mode === 'edit' && item) {
      setFormData({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type || 'article',
        content: item.content || '',
        fileUrl: item.fileUrl || '',
        date: item.date || '',
        tags: item.tags || []
      });
    } else {
      // Reset form for add mode
      setFormData({
        id: '',
        title: '',
        description: '',
        type: activeTab === 'resources' ? 'article' : 'webinar', 
        content: '',
        fileUrl: '',
        date: activeTab === 'events' ? new Date().toISOString().substr(0, 10) : '',
        tags: []
      });
    }
    
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = activeTab === 'resources' 
        ? `/api/resources${modalMode === 'edit' ? `/${formData.id}` : ''}`
        : `/api/events${modalMode === 'edit' ? `/${formData.id}` : ''}`;
        
      const method = modalMode === 'add' ? 'post' : 'put';
      
      await axios[method](endpoint, formData);
      
      fetchContentItems(); // Refresh the content list
      handleCloseModal();
    } catch (err) {
      setError(`Failed to ${modalMode} ${activeTab.slice(0, -1)}`);
      console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} ${activeTab.slice(0, -1)}:`, err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        const endpoint = activeTab === 'resources' 
          ? `/api/resources/${itemId}`
          : `/api/events/${itemId}`;
          
        await axios.delete(endpoint);
        fetchContentItems(); // Refresh the content list
      } catch (err) {
        setError(`Failed to delete ${activeTab.slice(0, -1)}`);
        console.error(`Error deleting ${activeTab.slice(0, -1)}:`, err);
      }
    }
  };

  // Filter items based on search term and type filter
  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const exportContent = () => {
    // In a real application, you would generate a CSV file here
    alert('Export functionality would download CSV/Excel data in a real application');
  };

  const resourceTypes = ['article', 'paper', 'book', 'video', 'code', 'tool'];
  const eventTypes = ['webinar', 'conference', 'workshop', 'meetup', 'hackathon'];

  return (
    <Container>
      <Header>
        <PageTitle>{activeTab === 'resources' ? 'Resource Management' : 'Event Management'}</PageTitle>
        <AddButton onClick={() => handleOpenModal('add')}>
          <FiPlus size={18} />
          <span>Add {activeTab === 'resources' ? 'Resource' : 'Event'}</span>
        </AddButton>
      </Header>

      <TabNav>
        <TabButton 
          active={activeTab === 'resources'} 
          onClick={() => setActiveTab('resources')}
        >
          <FiFileText size={16} />
          <span>Resources</span>
        </TabButton>
        <TabButton 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')}
        >
          <FiCalendar size={16} />
          <span>Events</span>
        </TabButton>
      </TabNav>

      <Filters>
        <SearchBar>
          <FiSearch size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <FilterDropdown>
          <FiFilter size={18} />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {activeTab === 'resources' 
              ? resourceTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))
              : eventTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))
            }
          </select>
        </FilterDropdown>

        <ExportButton onClick={exportContent}>
          <FiDownload size={16} />
          <span>Export</span>
        </ExportButton>
      </Filters>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingMessage>Loading {activeTab}...</LoadingMessage>
      ) : (
        <>
          <Table>
            <TableHeader>
              <th>Title</th>
              <th>Type</th>
              {activeTab === 'events' && <th>Date</th>}
              <th>Description</th>
              <th>Views</th>
              <th>Actions</th>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <td>{item.title}</td>
                    <td>
                      <TypeBadge type={item.type}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </TypeBadge>
                    </td>
                    {activeTab === 'events' && (
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                    )}
                    <td>
                      <TruncatedText>{item.description}</TruncatedText>
                    </td>
                    <td>{item.views || 0}</td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => handleOpenModal('edit', item)}>
                          <FiEdit2 size={16} />
                        </ActionButton>
                        <ActionButton danger onClick={() => handleDeleteItem(item.id)}>
                          <FiTrash2 size={16} />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={activeTab === 'events' ? 6 : 5} style={{ textAlign: 'center' }}>
                    No {activeTab} found
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {modalMode === 'add' ? `Add New ${activeTab === 'resources' ? 'Resource' : 'Event'}` : `Edit ${activeTab === 'resources' ? 'Resource' : 'Event'}`}
                </ModalTitle>
                <CloseButton onClick={handleCloseModal}>
                  <FiX size={20} />
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {activeTab === 'resources' 
                      ? resourceTypes.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))
                      : eventTypes.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))
                    }
                  </Select>
                </FormGroup>

                {activeTab === 'events' && (
                  <FormGroup>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </FormGroup>

                {activeTab === 'resources' && (
                  <>
                    <FormGroup>
                      <Label htmlFor="content">Content</Label>
                      <TextArea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="fileUrl">File URL or Upload</Label>
                      <FileUploadGroup>
                        <Input
                          type="text"
                          id="fileUrl"
                          name="fileUrl"
                          value={formData.fileUrl}
                          onChange={handleInputChange}
                          placeholder="Enter URL or upload file"
                        />
                        <UploadButton type="button">
                          <FiUpload size={16} />
                        </UploadButton>
                      </FileUploadGroup>
                    </FormGroup>
                  </>
                )}

                <FormGroup>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="crypto, algorithm, security, etc."
                  />
                </FormGroup>

                <FormActions>
                  <Button type="button" secondary onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" primary>
                    {modalMode === 'add' ? 'Add' : 'Update'} {activeTab === 'resources' ? 'Resource' : 'Event'}
                  </Button>
                </FormActions>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #303f9f;
  }
`;

const TabNav = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#3f51b5' : '#555'};
  border-bottom: 2px solid ${props => props.active ? '#3f51b5' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #3f51b5;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  
  svg {
    color: #666;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
  }
`;

const FilterDropdown = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  svg {
    color: #666;
    margin-right: 0.5rem;
  }
  
  select {
    border: none;
    outline: none;
    font-size: 0.875rem;
    background: transparent;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.tr`
  background-color: #f5f5f5;
  
  th {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #555;
  }
`;

const TableBody = styled.tbody`
  tr:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #333;
  }
`;

const TruncatedText = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  
  ${props => {
    switch (props.type) {
      case 'article':
        return `
          background-color: #e3f2fd;
          color: #1565c0;
        `;
      case 'paper':
        return `
          background-color: #e8f5e9;
          color: #2e7d32;
        `;
      case 'book':
        return `
          background-color: #fff8e1;
          color: #f57f17;
        `;
      case 'video':
        return `
          background-color: #f3e5f5;
          color: #6a1b9a;
        `;
      case 'code':
        return `
          background-color: #ede7f6;
          color: #4527a0;
        `;
      case 'tool':
        return `
          background-color: #e0f2f1;
          color: #00695c;
        `;
      case 'webinar':
        return `
          background-color: #bbdefb;
          color: #0d47a1;
        `;
      case 'conference':
        return `
          background-color: #c8e6c9;
          color: #1b5e20;
        `;
      case 'workshop':
        return `
          background-color: #ffecb3;
          color: #ff6f00;
        `;
      case 'meetup':
        return `
          background-color: #d1c4e9;
          color: #311b92;
        `;
      case 'hackathon':
        return `
          background-color: #b2dfdb;
          color: #004d40;
        `;
      default:
        return `
          background-color: #eeeeee;
          color: #616161;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.danger ? '#fff5f5' : '#f1f3f5'};
  color: ${props => props.danger ? '#e03131' : '#495057'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? '#ffe3e3' : '#e9ecef'};
  }
`;

const ModalOverlay = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
  }
`;

const FileUploadGroup = styled.div`
  display: flex;
  align-items: center;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: #f5f5f5;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #eee;
  }
  
  ${Input} + & {
    margin-left: -1px;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    if (props.primary) {
      return `
        background-color: #3f51b5;
        color: white;
        
        &:hover {
          background-color: #303f9f;
        }
      `;
    } else if (props.secondary) {
      return `
        background-color: #f1f3f5;
        color: #495057;
        
        &:hover {
          background-color: #e9ecef;
        }
      `;
    }
  }}
`;

export default ContentManagement;
