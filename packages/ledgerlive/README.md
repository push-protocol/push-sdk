# ledgerlive
This is adapted from [Ledger's IFRAME Provider](https://www.npmjs.com/package/@ledgerhq/iframe-provider)

Used to wrap a dApp if it is running in Ledger context (inside Ledger Live) then use the Ledger Live connector.

## Installation
```
yarn add @pushprotocol/ledgerlive
```

## Usage

### creating the connector
```typescript
import { LedgerHQFrameConnector } from "@pushprotocol/ledgerlive";

const ledgerLiveConnector = new LedgerHQFrameConnector();
```

### checking for the Ledger context
```typescript
import { isLedgerDappBrowserProvider } from "@pushprotocol/ledgerlive";

const isRunninginLedgerContext = isLedgerDappBrowserProvider(); // boolean
```

### using the ledgerLiveConnector when in ledger context
```typescript
import { useWeb3React } from '@web3-react/core';
import { isLedgerDappBrowserProvider } from '@pushprotocol/ledgerlive';

export const injected = new InjectedConnector({ supportedChainIds: [1, 5] })

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    // If is ledger dapp, use ledger connector. Else use injected connector
    if (isLedgerDappBrowserProvider()) {
      activate(ledgerLiveConnector, undefined, true).catch(() => {
        setTried(true);
      });
    } else {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }

  }, [activate])
 
  .
  .

  return tried
}
```

