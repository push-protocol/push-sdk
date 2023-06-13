import React from 'react';
import SettingsIcon from '../../../icons/settings.svg';
import styled from 'styled-components';

export const WidgetHeader: React.FC = () => {

  return (
    <Container>
      {true && 
        <Section>
          <ProfileContainer>
            <PfpContainer>
              <Pfp src={"https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"} alt="pfp" />
            </PfpContainer>
            <HostContainer>
              <HostName>
                Laris
                <Host status="live">Host</Host>
              </HostName>
              <HostHandle status="live">
                {/* Fetch the handle from Lenster */}@hbjbjhb
              </HostHandle>
            </HostContainer>
          </ProfileContainer>
          <div style={{display: 'flex'}}>
            <Button padding='6.5px 16.5px'>Edit space</Button>
            <Image
              src={SettingsIcon}
              alt="Minimize icon"
            />
          </div>
        </Section>
      }
      <Text>Lenster partners with Push Protocol to bring seamless and secure data transfer</Text>
      {/* Lenster partners with Push Protocol to bring seamless and secure data transfer */}
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px 12px 0 0;
  color: white;
  padding: 16px 24px;
  background: linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%), linear-gradient(87.17deg, #EA4E93 0%, #DB2777 0.01%, #9963F7 100%), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 50.52%, #FFDED3 100%, #FFCFC5 100%), linear-gradient(0deg, #8B5CF6, #8B5CF6), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%), #FFFFFF;
`;

const Image = styled.img`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: initial;
  cursor: pointer;
  height: ${(props: any): string => props.height || '24px'};
  width: ${(props: any): string => props.width || '20px'};
  align-self: center;
`;

const Section = styled.div`
  display: flex;
  justify-content: space-between;
`

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
  align-items: center;
  margin-bottom: 12px;
}`;

const PfpContainer = styled.div`
  display: flex;
}`;

const Pfp = styled.img`
  height: 32px;
  width: 32px;
  border-radius: 50%;
}`;

const HostContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
samarendra-push marked this conversation as resolved.
  font-family: 'Strawford';
  padding-left: 8px;
}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 15px;
}`;

const Text = styled.div`
  display: flex;
  font-weight: 700;
  font-size: 16px;
}`;

const Host = styled.div<{ status?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  margin-left: 8px;
  line-height: 18px;
  width: max-content;
  height: 19px;
  background: ${(props) =>
    props.status === 'live'
      ? 'rgba(255, 255, 255, 0.2);'
      : 'rgba(139, 92, 246, 0.2)'};
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#8B5CF6')};
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
}`;

const HostHandle = styled.div<{ status?: string }>`
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#71717A')};
  padding: 0;
  font-weight: 450;
  font-size: 14px;
  line-height: 130%;
}`;

const Button = styled.button<{
  padding?: string;
  color?: string;
}>`
  padding: ${(props) => (props.padding ?? '0px')};
  color: ${(props) => props.color ?? 'inherit'};
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  border: none;
  cursor: pointer;
`