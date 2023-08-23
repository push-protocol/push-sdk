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
import SpaceTest from '../SpaceTest/SpaceTest';

const CreateSpaceTest = () => {
  const { account: acc, library } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);
  const [spaceName, setSpaceName] = useState<string>('');
  const [spaceDescription, setSpaceDescription] = useState<string>('');
  const [members, setMembers] = useState<string>('');
  const [spaceImage, setSpaceImage] = useState<string>('');
  const [admins, setAdmins] = useState<string>('');
  const [isPublic, setIsPublic] = useState<string>('');
  const [contractAddressNFT, setContractAddressNFT] = useState<string>();
  const [numberOfNFTs, setNumberOfNFTs] = useState<string>();
  const [contractAddressERC20, setContractAddressERC20] = useState<string>();
  const [numberOfERC20, setNumberOfERC20] = useState<string>();
  const [meta, setMeta] = useState<string>();
  const [scheduleAt, setScheduleAt] = useState<string>('');
  const [scheduleEnd, setScheduleEnd] = useState<string>();
  const [account, setAccount] = useState<string>(acc);

  const [sendResponse, setSendResponse] = useState<any>('');

  const updateSpaceName = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceName((e.target as HTMLInputElement).value);
  };

  const updateSpaceDescription = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceDescription((e.target as HTMLInputElement).value);
  };

  const updateMembers = (e: React.SyntheticEvent<HTMLElement>) => {
    setMembers((e.target as HTMLInputElement).value);
  };

  const updateSpaceImage = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceImage((e.target as HTMLInputElement).value);
  };

  const updateAdmins = (e: React.SyntheticEvent<HTMLElement>) => {
    setAdmins((e.target as HTMLInputElement).value);
  };

  const updateIsPublic = (e: React.SyntheticEvent<HTMLElement>) => {
    setIsPublic((e.target as HTMLInputElement).value);
  };

  const updateContractAddressNFT = (e: React.SyntheticEvent<HTMLElement>) => {
    setContractAddressNFT((e.target as HTMLInputElement).value);
  };

  const updateNumberOfNFTs = (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfNFTs((e.target as HTMLInputElement).value);
  };

  const updateContractAddressERC20 = (e: React.SyntheticEvent<HTMLElement>) => {
    setContractAddressERC20((e.target as HTMLInputElement).value);
  };

  const updateNumberOfERC20 = (e: React.SyntheticEvent<HTMLElement>) => {
    setNumberOfERC20((e.target as HTMLInputElement).value);
  };

  const updateMeta = (e: React.SyntheticEvent<HTMLElement>) => {
    setMeta((e.target as HTMLInputElement).value);
  };

  const updateScheduleAt = (e: React.SyntheticEvent<HTMLElement>) => {
    setScheduleAt((e.target as HTMLInputElement).value);
  };

  const updateScheduleEnd = (e: React.SyntheticEvent<HTMLElement>) => {
    setScheduleEnd((e.target as HTMLInputElement).value);
  };

  const updateAccount = (e: React.SyntheticEvent<HTMLElement>) => {
    setAccount((e.target as HTMLInputElement).value);
  };

  const testCreateSpace = async () => {
    try {
      setLoading(true);
      const librarySigner = await library.getSigner();

      const response = await PushAPI.space.create({
        spaceName,
        spaceDescription,
        listeners: members.split(','),
        spaceImage,
        speakers: admins.split(','),
        isPublic: isPublic === 'true',
        contractAddressNFT,
        numberOfNFTs: numberOfNFTs != null ? Number(numberOfNFTs) : undefined,
        contractAddressERC20,
        numberOfERC20:
          numberOfERC20 != null ? Number(numberOfERC20) : undefined,
        signer: librarySigner,
        env,
        // meta: meta,
        scheduleAt: new Date(scheduleAt),
        scheduleEnd: scheduleEnd ? new Date(scheduleEnd) : null,
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
      <h2>Create Space Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <SectionItem>
          <div>
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

            <SectionItem>
              <label>members</label>
              <input
                type="text"
                onChange={updateMembers}
                value={members}
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
              <label>admins</label>
              <input
                type="text"
                onChange={updateAdmins}
                value={admins}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>isPublic</label>
              <input
                type="text"
                onChange={updateIsPublic}
                value={isPublic}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>contractAddressNFT</label>
              <input
                type="text"
                onChange={updateContractAddressNFT}
                value={contractAddressNFT}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>numberOfNFTs</label>
              <input
                type="text"
                onChange={updateNumberOfNFTs}
                value={numberOfNFTs}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>contractAddressERC20</label>
              <input
                type="text"
                onChange={updateContractAddressERC20}
                value={contractAddressERC20}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>numberOfERC20</label>
              <input
                type="text"
                onChange={updateNumberOfERC20}
                value={numberOfERC20}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>Account</label>
              <input
                type="text"
                onChange={updateAccount}
                value={account}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>meta</label>
              <input
                type="text"
                onChange={updateMeta}
                value={meta}
                style={{ width: 400, height: 30 }}
              />
            </SectionItem>

            <SectionItem style={{ marginTop: 20 }}>
              <label>scheduleAt (2023-06-30T00:00:00.000Z)</label>
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
              <SectionButton onClick={testCreateSpace}>
                create space
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

export default CreateSpaceTest;
