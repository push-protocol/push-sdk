import type Space from './Space';
import { get } from './get';

export interface InitializeType {
  spaceId: string;
}

export async function initialize(this: Space, options: InitializeType) {
  const { spaceId } = options || {};

  const space = await get({
    spaceId,
    env: this.env,
  });

  this.setSpaceSpecificData(() => space);
}
