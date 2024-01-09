import { SPACE_INVITE_ROLES } from '../payloads/constants';
import { SpaceInfoDTO } from '../types';
import Space from './Space';
import { ChatUpdateSpaceType } from './update';

export class SpaceV2 {
  private spaceV1Instance: Space;
  private spaceInfo: SpaceInfoDTO;

  constructor({
    spaceV1Instance,
    spaceInfo,
  }: {
    spaceV1Instance: Space;
    spaceInfo: SpaceInfoDTO;
  }) {
    this.spaceV1Instance = spaceV1Instance;
    this.spaceInfo = spaceInfo;
  }

  async activateUserAudio() {
    await this.spaceV1Instance.createAudioStream();
  }

  async start() {
    await this.spaceV1Instance.start();
  }

  async join() {
    await this.spaceV1Instance.join();
  }

  async update(updateSpaceOptions: ChatUpdateSpaceType) {
    await this.spaceV1Instance.update(updateSpaceOptions);
  }

  async leave() {
    await this.spaceV1Instance.leave();
  }

  async stop() {
    await this.spaceV1Instance.stop();
  }

  async requestForMic() {
    await this.spaceV1Instance.requestToBePromoted({
      role: SPACE_INVITE_ROLES.SPEAKER,
      promotorAddress: this.spaceInfo.spaceCreator,
    });
  }

  async acceptMicRequest({
    address,
    signal,
  }: {
    address: string;
    signal: any;
  }) {
    await this.spaceV1Instance.acceptPromotionRequest({
      promoteeAddress: address,
      spaceId: this.spaceInfo.spaceId,
      role: SPACE_INVITE_ROLES.SPEAKER,
      signalData: signal,
    });
  }

  async rejectMicRequest({ address }: { address: string }) {
    await this.spaceV1Instance.rejectPromotionRequest({
      promoteeAddress: address,
    });
  }

  async inviteToPromote({ address }: { address: string }) {
    await this.spaceV1Instance.inviteToPromote({
      inviteeAddress: address,
      role: SPACE_INVITE_ROLES.SPEAKER,
    });
  }

  async acceptPromotionInvite({ signal }: { signal: any }) {
    await this.spaceV1Instance.acceptPromotionInvite({
      invitorAddress: this.spaceInfo.spaceCreator,
      spaceId: this.spaceInfo.spaceId,
      signalData: signal,
    });
  }

  async rejectPromotionInvite() {
    await this.spaceV1Instance.rejectPromotionInvite({
      invitorAddress: this.spaceInfo.spaceCreator,
    });
  }

  media({ video, audio }: { video?: boolean; audio?: boolean }) {
    if (typeof video === 'boolean') {
      this.spaceV1Instance.enableVideo({ state: video });
    }

    if (typeof audio === 'boolean') {
      this.spaceV1Instance.enableAudio({ state: audio });
    }
  }
}
