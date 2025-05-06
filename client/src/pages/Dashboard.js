import React from 'react';
import styled from 'styled-components';
import DashboardResources from '../components/dashboard/DashboardResources';

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <div className="container">
        <DashboardResources />
      </div>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  padding: 2rem 0;
  background: ${({ theme }) => theme.colors.backgroundLight};
  min-height: calc(100vh - 60px);
`;

export default Dashboard;