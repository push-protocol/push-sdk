import styled from 'styled-components';

type FeedbackType = {
  status?: string;
};
  

export const Feedback = styled.div<FeedbackType>`
    background: ${(props) => {
    if (props.status === "error") {
    return '#efc3ba';
    }
    return '#d4efe7';
    }};
    border-color: ${(props) => {
    if (props.status === "error") {
    return '#efc3ba';
    }
    return '#d4efe7';
    }};
    border-radius: 7px;
    border-width: 2px;

    display: flex;
    padding: 25px;
    justify-content: center;
    font-size: 1rem;
    margin: 30px;
    word-break: break-word;
`;

export const APIFeedback = (props: { status: any, children: any }) => {
    return (
        <Feedback status={props.status}>
            {props.children}
        </Feedback>
    );
};