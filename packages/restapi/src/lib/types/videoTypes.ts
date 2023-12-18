export type VideoPeerInfo = {
  address: string;
  signal: any;
  meta: {
    // TODO: replace this type once old PR is merged
    rules: any;
  };
};
