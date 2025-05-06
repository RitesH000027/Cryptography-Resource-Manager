import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaSearch, FaExclamationCircle, FaUserEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        setLoading(true);
        const response = await axios.get('http://0.0.0.0:5001/api/admin/users', {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchUsers();
  }, [user]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://0.0.0.0:5001/api/admin/users/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return (
    <UsersContainer>
      <div className="container">
        <BackLink to="/admin/dashboard">
          <FaArrowLeft /> Back to Dashboard
        </BackLink>
        
        <PageHeader>
          <PageTitle>Manage Users</PageTitle>
          <PageDescription>
            View and manage all users of your platform
          </PageDescription>
        </PageHeader>
        
        {error && (
          <ErrorMessage>
            <FaExclamationCircle />
            <span>{error}</span>
          </ErrorMessage>
        )}
        
        <SearchContainer>
          <SearchBar>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBar>
        </SearchContainer>
        
        {loading ? (
          <LoadingMessage>Loading users...</LoadingMessage>
        ) : filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No users found</EmptyTitle>
            <EmptyDescription>
              {searchTerm ? 'Try adjusting your search term.' : 'No users have been registered yet.'}
            </EmptyDescription>
          </EmptyState>
        ) : (
          <UsersTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Joined</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </RoleBadge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton as={Link} to={`/admin/users/edit/${user._id}`}>
                        <FaUserEdit />
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleDeleteUser(user._id)}
                        danger
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </UsersTable>
        )}
      </div>
    </UsersContainer>
  );
};

const UsersContainer = styled.div`
  padding: 2rem 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  font-weight: 500;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 3rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => `${theme.colors.gray}20`};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.gray}10`};
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${({ role, theme }) => 
    role === 'admin' ? `${theme.colors.primary}20` : `${theme.colors.success}20`};
  color: ${({ role, theme }) => 
    role === 'admin' ? theme.colors.primary : theme.colors.success};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  background-color: ${({ danger, theme }) => 
    danger ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  color: ${({ danger, theme }) => 
    danger ? theme.colors.error : theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ danger, theme }) => 
      danger ? theme.colors.error : theme.colors.primary};
    color: white;
  }
`;

export default Users;