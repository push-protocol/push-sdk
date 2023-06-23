import React from 'react';
import { Section, Span } from '../../../reusables';

type NewMessageContentType = {
    IconComponent:any,
    title:string,
    subTitle:string
  };

const NewMessageContent: React.FC<NewMessageContentType> = ({
    IconComponent,
    title,
    subTitle
}) => {
    return (
        <Section flexDirection='column' margin='77px 0 0 0 ' gap='15px'>

            {IconComponent}
            <Section flexDirection='column' gap='10px'>
              <Span
                textAlign="center"
                fontSize="18px"
                fontWeight="700"
                lineHeight='24px'
                color={'#62626A'}
              >
                {title}
              </Span>
              <Span
                textAlign="center"
                fontSize="14px"
                fontWeight="400"
                lineHeight='20px'
                color={'#62626A'}
                padding='0px 100px'

              >
                {subTitle}
              </Span>
            </Section>
          </Section>
    );
};

export default NewMessageContent;