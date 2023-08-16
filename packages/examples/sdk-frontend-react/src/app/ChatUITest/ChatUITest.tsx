import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import Loader from '../components/Loader';

const ChatUITest = () => {
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
      <h2>Chat UI Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <NavMenu>
        <Link to="/profileHeader" className="nav-button">
            PROFILE HEADER
          </Link>
          <Link to="/messageBubble" className="nav-button">
            CHAT BUBBLE
          </Link>
          <Link to="/messageList" className="nav-button">
            MESSAGE LIST
          </Link>
          <Link to="/messageContainer" className="nav-button">
            MESSAGE CONTAINER
          </Link>
        </NavMenu>
      </Section>
    </div>
  );
};

export default ChatUITest;
