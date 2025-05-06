import React from 'react';
import styled from 'styled-components';

const DashboardHome = () => {
  return (
    <Container>
      <WelcomeSection>
        <h1>Welcome to Cryptography Resource Manager Dashboard</h1>
        <UserManual>
          <h2>User Manual</h2>
          <ManualSection>
            <h3>Resources</h3>
            <p>Browse, add, update, or remove cryptography learning materials, documents, and resources. You can manage files, links, and educational content.</p>
          </ManualSection>
          <ManualSection>
            <h3>Users</h3>
            <p>Manage user accounts, permissions, and access levels. Add new users, update profiles, or remove existing users from the system.</p>
          </ManualSection>
          <ManualSection>
            <h3>Events</h3>
            <p>Schedule and manage cryptography-related events, workshops, and meetings. Create new events, update details, or cancel existing events.</p>
          </ManualSection>
          <ManualSection>
            <h3>Professors</h3>
            <p>Manage professor profiles and their associated courses. Add new professors, update their information, or remove them from the system.</p>
          </ManualSection>
        </UserManual>
      </WelcomeSection>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    color: #1a237e;
    margin-bottom: 2rem;
  }
`;

const UserManual = styled.div`
  margin-top: 2rem;

  h2 {
    color: #1a237e;
    margin-bottom: 1.5rem;
  }
`;

const ManualSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: #283593;
    margin-bottom: 0.5rem;
  }

  p {
    color: #424242;
    line-height: 1.5;
  }
`;

export default DashboardHome;
