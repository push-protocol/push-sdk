import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { Section } from '../components/StyledComponents';

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
          <Link to="/ChatProfile" className="nav-button">
            CHAT PROFILE
          </Link>
          <Link to="/ChatViewBubble" className="nav-button">
            CHAT BUBBLE
          </Link>
          <Link to="/ChatViewList" className="nav-button">
            CHAT VIEW LIST
          </Link>
          <Link to="/ChatView" className="nav-button">
            CHAT VIEW
          </Link>
          <Link to="/ChatPreview" className="nav-button">
            CHAT PREVIEW
          </Link>
          <Link to="/ChatPreviewList" className="nav-button">
            CHAT PREVIEW LIST
          </Link>
          <Link to="/ChatPreviewSearchList" className="nav-button">
            CHAT PREVIEW SEARCH LIST
          </Link>
          <Link to="/userProfile" className="nav-button">
            USER PROFILE COMPONENT
          </Link>
        </NavMenu>
      </Section>
    </div>
  );
};

export default ChatUITest;
