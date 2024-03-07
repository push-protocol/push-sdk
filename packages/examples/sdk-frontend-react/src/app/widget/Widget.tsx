import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import Loader from '../components/Loader';

const Widget = () => {
  const [isLoading, setIsLoading] = useState(false);

  const NavMenu = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;

    @media only screen and (max-width: 900px) {
      flex-direction: column;
    }
  `;

  return (
    <div>
      <h2>Widget Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <NavMenu>
        <Link to="/subscriptionManager" className="nav-button">
           SUBSCRIPTION MANAGER
          </Link>
        
       
        </NavMenu>
      </Section>
    </div>
  );
};

export default Widget;
