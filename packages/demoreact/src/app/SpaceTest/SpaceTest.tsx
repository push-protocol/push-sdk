import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Section,
} from '../components/StyledComponents';
import Loader from '../components/Loader';

const SpaceTest = () => {
  const [isLoading, setLoading] = useState(false);

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
      <h2>Space Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <NavMenu>
          <Link to="/createSpace" className="nav-button">
            SPACE.CREATE
          </Link>
          <Link to="/updateSpace" className="nav-button">
            SPACE.UPDATE
          </Link>
          <Link to="/getSpace" className="nav-button">
            SPACE.GET
          </Link>
          <Link to="/getSpaceInfo" className="nav-button">
            SPACE.INFO
          </Link>
          <Link to="/approveSpace" className="nav-button">
            SPACE.APPROVE
          </Link>
          <Link to="/startSpace" className="nav-button">
            SPACE.START
          </Link>
          <Link to="/stopSpace" className="nav-button">
            SPACE.STOP
          </Link>
        </NavMenu>
      </Section>
    </div>
  );
};

export default SpaceTest;
