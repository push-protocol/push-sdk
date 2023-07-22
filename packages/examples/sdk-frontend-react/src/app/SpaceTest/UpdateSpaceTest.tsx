import { useState, useContext } from 'react';
import {
  Section,
  SectionItem,
  CodeFormatter,
  SectionButton,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import { Web3Context, EnvContext } from '../context';
import * as PushAPI from '@pushprotocol/restapi';
import { walletToPCAIP10 } from '../helpers';
import SpaceTest from './SpaceTest';
import { stringToChatStatus } from './../ChatTest/helper';

const UpdateSpaceTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [spaceId, setSpaceId] = useState<string>('');
  const [spaceName, setSpaceName] = useState<string>('');
  const [spaceImage, setSpaceImage] = useState<string>('');
  const [spaceDescription, setSpaceDescription] = useState<string>('');
  const [members, setMembers] = useState<string>('');
  const [admins, setAdmins] = useState<string>('');
  const [scheduleAt, setScheduleAt] = useState<string>('');
  const [scheduleEnd, setScheduleEnd] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [account, setAccount] = useState<string>(acc);

  const [sendResponse, setSendResponse] = useState<any>('');

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  const updateSpaceName = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceName((e.target as HTMLInputElement).value);
  };
  const updateSpaceDescription = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceDescription((e.target as HTMLInputElement).value);
  };

  const updateSpaceImage = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceImage((e.target as HTMLInputElement).value);
  };

  const updateMembers = (e: React.SyntheticEvent<HTMLElement>) => {
    setMembers((e.target as HTMLInputElement).value);
  };

  const updateAdmins = (e: React.SyntheticEvent<HTMLElement>) => {
    setAdmins((e.target as HTMLInputElement).value);
  };

  const updateScheduleAt = (e: React.SyntheticEvent<HTMLElement>) => {
    setScheduleAt((e.target as HTMLInputElement).value);
  };

  const updateScheduleEnd = (e: React.SyntheticEvent<HTMLElement>) => {
    setScheduleEnd((e.target as HTMLInputElement).value);
  };

  const updateStatus = (e: React.SyntheticEvent<HTMLElement>) => {
    setStatus((e.target as HTMLInputElement).value);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const updateSpaceTest = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();

      const response = await PushAPI.space.update({
        spaceId,
        spaceName,
        spaceImage,
        spaceDescription,
        listeners: members.split(','),
        speakers: admins.split(','),
        signer: librarySigner,
        env,
        scheduleAt: new Date(scheduleAt),
        scheduleEnd: scheduleEnd ? new Date(scheduleEnd) : null,
        status: stringToChatStatus(status),
      });

      setSendResponse(response);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SpaceTest />
      <h2>Update Space Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
            <SectionItem>
              <label>spaceId</label>
              <input
                type="text"
                onChange={updateSpaceId}
                value={spaceId}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem>
              <label>Space Name</label>
              <input
                type="text"
                onChange={updateSpaceName}
                value={spaceName}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem>
              <label>Space Description</label>
              <input
                type="text"
                onChange={updateSpaceDescription}
                value={spaceDescription}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>spaceImage</label>
              <input
                type="text"
                onChange={updateSpaceImage}
                value={spaceImage}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>members</label>
              <input
                type="text"
                onChange={updateMembers}
                value={members}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>admins</label>
              <input
                type="text"
                onChange={updateAdmins}
                value={admins}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>scheduleAt</label>
              <input
                type="text"
                onChange={updateScheduleAt}
                value={scheduleAt}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>scheduleEnd</label>
              <input
                type="text"
                onChange={updateScheduleEnd}
                value={scheduleEnd}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>status</label>
              <input
                type="text"
                onChange={updateStatus}
                value={status}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <label>Group Creator ( Waller Addr or NFT DID )</label>
              <input
                type="text"
                onChange={updateAccount}
                value={account}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>
            <SectionItem style={{ marginTop: 20 }}>
              <SectionButton onClick={updateSpaceTest}>
                update space
              </SectionButton>
            </SectionItem>
          </div>
        </SectionItem>

        <SectionItem>
          <div>
            {sendResponse ? (
              <CodeFormatter>
                {JSON.stringify(sendResponse, null, 4)}
              </CodeFormatter>
            ) : null}
          </div>
        </SectionItem>
      </Section>
    </div>
  );
};

export default UpdateSpaceTest;
