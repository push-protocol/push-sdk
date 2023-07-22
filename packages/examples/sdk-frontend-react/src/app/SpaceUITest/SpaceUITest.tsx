import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import Loader from '../components/Loader';

const SpaceUITest = () => {
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
      <h2>Space UI Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <NavMenu>
          <Link to="/spaceWidget" className="nav-button">
            SPACES WIDGET
          </Link>
          <Link to="/spaceFeed" className="nav-button">
            SPACES FEED
          </Link>
          <Link to="/spaceBanner" className="nav-button">
            SPACES BANNER
          </Link>
          <Link to="/createSpaceUI" className="nav-button">
            CREATE SPACE
          </Link>
          <Link to="/spaceInvites" className="nav-button">
            SPACES INVITES
          </Link>
        </NavMenu>
      </Section>
    </div>
  );
};

export default SpaceUITest;
