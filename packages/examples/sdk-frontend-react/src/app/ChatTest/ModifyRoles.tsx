import { useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import { EnvContext, Web3Context } from '../context';
import * as PushAPI from '@pushprotocol/restapi';
import ChatTest from './ChatTest';

const ModifyRolesTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [modifyRolesResponse, setModifyRolesResponse] = useState<any>('');
  const [chatId, setChatId] = useState<string>('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [role, setRole] = useState<any>('');
  const updateChatId = (e: React.SyntheticEvent<HTMLElement>) => {
    setChatId((e.target as HTMLInputElement).value);
  };
  const updateRole = (e: React.SyntheticEvent<HTMLElement>) => {
    setRole((e.target as HTMLInputElement).value);
  };
  const updateAddress = (e: React.SyntheticEvent<HTMLElement>) => {
    const inputAddresses = (e.target as HTMLInputElement).value
      .split(',')
      .map((item) => item.trim());

    setAddresses(inputAddresses);
  };

  const testModifyRoles = async () => {
    try {
      setLoading(true);
      const librarySigner = library.getSigner();
      const response = await PushAPI.chat.modifyRoles({
        chatId: chatId,
        newRole: role,
        members: addresses,
        env,
        signer: librarySigner,
        account: acc,
      });

      setModifyRolesResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ChatTest />
      <h2>Modify Roles Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
          <SectionItem style={{ marginTop: 20 }}>
            <label>chatId</label>
            <input
              type="text"
              onChange={updateChatId}
              value={chatId}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <label>New Role (ADMIN or MEMBER)</label>
            <input
              type="text"
              onChange={updateRole}
              value={role}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <SectionItem style={{ marginTop: 20 }}>
            <label>addresses separated by a comma</label>
            <input
              type="text"
              onChange={updateAddress}
              value={addresses}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>

          <SectionItem style={{ marginTop: 20 }}>
            <SectionButton onClick={testModifyRoles}>
              Modify Roles
            </SectionButton>
          </SectionItem>
        </div>
        <SectionItem>
          <div>
            {modifyRolesResponse ? (
              <CodeFormatter>
                {JSON.stringify(modifyRolesResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default ModifyRolesTest;
