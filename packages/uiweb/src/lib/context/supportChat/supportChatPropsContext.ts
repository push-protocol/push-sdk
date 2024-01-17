import { createContext } from 'react'
import { ChatProps } from '../../components/supportChat/Chat';


const SupportChatPropsContext = createContext<ChatProps>({});

export default SupportChatPropsContext;