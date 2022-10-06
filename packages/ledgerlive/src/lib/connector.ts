import invariant from 'tiny-invariant';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { isLedgerDappBrowserProvider } from './helpers';

import type { ConnectorUpdate } from '@web3-react/types';
import type { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';

type IFrameEthereumProviderOptions = ConstructorParameters<
  typeof IFrameEthereumProvider
>[0];

const MAINNET_CHAIN_ID = 1;

export class LedgerHQFrameConnector extends AbstractConnector {
  private config: IFrameEthereumProviderOptions;
  public provider?: IFrameEthereumProvider;

  constructor(config?: IFrameEthereumProviderOptions) {
    super({ supportedChainIds: [MAINNET_CHAIN_ID] });
    this.config = config;

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this);
    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private handleNetworkChanged(networkId: string): void {
    this.emitUpdate({ provider: this.provider, chainId: networkId });
  }

  private handleChainChanged(chainId: string): void {
    this.emitUpdate({ chainId });
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts.length === 0 ? null : accounts[0] });
  }

  private handleClose(): void {
    this.emitDeactivate();
  }

  public isLedgerApp(): boolean {
    return isLedgerDappBrowserProvider();
  }

  public async getProviderInstance(): Promise<IFrameEthereumProvider> {
    if (this.provider) return this.provider;

    const { IFrameEthereumProvider } = await import(
      '@ledgerhq/iframe-provider'
    );
    return new IFrameEthereumProvider(this.config);
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      this.provider = await this.getProviderInstance();
    }

    this.provider.on('networkChanged', this.handleNetworkChanged);
    this.provider.on('chainChanged', this.handleChainChanged);
    this.provider.on('accountsChanged', this.handleAccountsChanged);
    this.provider.on('close', this.handleClose);

    const accounts = await this.provider.enable();
    const account = accounts[0];

    return { provider: this.provider, account };
  }

  public async getProvider(): Promise<IFrameEthereumProvider | undefined> {
    return this.provider;
  }

  public async getChainId(): Promise<number | string> {
    invariant(this.provider, 'Provider is not defined');
    return this.provider.send('eth_chainId');
  }

  public async getAccount(): Promise<null | string> {
    invariant(this.provider, 'Provider is not defined');

    const accounts = await this.provider.send('eth_accounts');
    const account = accounts[0];

    return account;
  }

  public deactivate(): void {
    invariant(this.provider, 'Provider is not defined');

    this.provider.removeListener('networkChanged', this.handleNetworkChanged);
    this.provider.removeListener('chainChanged', this.handleChainChanged);
    this.provider.removeListener('accountsChanged', this.handleAccountsChanged);
    this.provider.removeListener('close', this.handleClose);
  }
}