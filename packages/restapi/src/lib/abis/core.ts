export default [
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "uint256", "name": "amountRefunded", "type": "uint256" }
      ],
      "name": "TimeBoundChannelDestroyed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "enum EPNSCoreV1.ChannelType", "name": "channelType", "type": "uint8" },
        { "indexed": false, "internalType": "bytes", "name": "identity", "type": "bytes" }
      ],
      "name": "AddChannel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "channel", "type": "address" }],
      "name": "ChannelBlocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "address", "name": "_channel", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "totalNotifOptions", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "_notifSettings", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "_notifDescription", "type": "string" }
      ],
      "name": "ChannelNotifcationSettingsAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "revoker", "type": "address" }
      ],
      "name": "ChannelVerificationRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "verifier", "type": "address" }
      ],
      "name": "ChannelVerified",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "uint256", "name": "amountRefunded", "type": "uint256" }
      ],
      "name": "DeactivateChannel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": true, "internalType": "uint256", "name": "amountDeposited", "type": "uint256" }
      ],
      "name": "ReactivateChannel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "channel", "type": "address" },
        { "indexed": false, "internalType": "bytes", "name": "identity", "type": "bytes" }
      ],
      "name": "UpdateChannel",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADD_CHANNEL_MIN_FEES",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ADD_CHANNEL_MIN_POOL_CONTRIBUTION",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "CHANNEL_DEACTIVATION_FEES",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "POOL_FUNDS",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PROTOCOL_POOL_FEES",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PUSH_TOKEN_ADDRESS",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "REFERRAL_CODE",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "UNISWAP_V2_ROUTER",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "WETH_ADDRESS",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "aDaiAddress",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_startIndex", "type": "uint256" },
        { "internalType": "uint256", "name": "_endIndex", "type": "uint256" },
        { "internalType": "address[]", "name": "_channelList", "type": "address[]" }
      ],
      "name": "batchRevokeVerification",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_startIndex", "type": "uint256" },
        { "internalType": "uint256", "name": "_endIndex", "type": "uint256" },
        { "internalType": "address[]", "name": "_channelList", "type": "address[]" }
      ],
      "name": "batchVerification",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_channelAddress", "type": "address" }],
      "name": "blockChannel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "name": "channelById",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "channelNotifSettings",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "channels",
      "outputs": [
        { "internalType": "enum EPNSCoreV1.ChannelType", "name": "channelType", "type": "uint8" },
        { "internalType": "uint8", "name": "channelState", "type": "uint8" },
        { "internalType": "address", "name": "verifiedBy", "type": "address" },
        { "internalType": "uint256", "name": "poolContribution", "type": "uint256" },
        { "internalType": "uint256", "name": "channelHistoricalZ", "type": "uint256" },
        { "internalType": "uint256", "name": "channelFairShareCount", "type": "uint256" },
        { "internalType": "uint256", "name": "channelLastUpdate", "type": "uint256" },
        { "internalType": "uint256", "name": "channelStartBlock", "type": "uint256" },
        { "internalType": "uint256", "name": "channelUpdateBlock", "type": "uint256" },
        { "internalType": "uint256", "name": "channelWeight", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "channelsCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "createChannelForPushChannelAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_notifOptions", "type": "uint256" },
        { "internalType": "string", "name": "_notifSettings", "type": "string" },
        { "internalType": "string", "name": "_notifDescription", "type": "string" }
      ],
      "name": "createChannelSettings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "enum EPNSCoreV1.ChannelType", "name": "_channelType", "type": "uint8" },
        { "internalType": "bytes", "name": "_identity", "type": "bytes" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "createChannelWithFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "daiAddress",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_amountsOutValue", "type": "uint256" }],
      "name": "deactivateChannel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "epnsCommunicator",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_channel", "type": "address" }],
      "name": "getChannelState",
      "outputs": [{ "internalType": "uint256", "name": "state", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_channel", "type": "address" }],
      "name": "getChannelVerfication",
      "outputs": [{ "internalType": "uint8", "name": "verificationStatus", "type": "uint8" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "governance",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupFairShareCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupHistoricalZ",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupLastUpdate",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupNormalizedWeight",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_pushChannelAdmin", "type": "address" },
        { "internalType": "address", "name": "_pushTokenAddress", "type": "address" },
        { "internalType": "address", "name": "_wethAddress", "type": "address" },
        { "internalType": "address", "name": "_uniswapRouterAddress", "type": "address" },
        { "internalType": "address", "name": "_lendingPoolProviderAddress", "type": "address" },
        { "internalType": "address", "name": "_daiAddress", "type": "address" },
        { "internalType": "address", "name": "_aDaiAddress", "type": "address" },
        { "internalType": "uint256", "name": "_referralCode", "type": "uint256" }
      ],
      "name": "initialize",
      "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isMigrationComplete",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lendingPoolProviderAddress",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_startIndex", "type": "uint256" },
        { "internalType": "uint256", "name": "_endIndex", "type": "uint256" },
        { "internalType": "address[]", "name": "_channelAddresses", "type": "address[]" },
        { "internalType": "enum EPNSCoreV1.ChannelType[]", "name": "_channelTypeList", "type": "uint8[]" },
        { "internalType": "bytes[]", "name": "_identityList", "type": "bytes[]" },
        { "internalType": "uint256[]", "name": "_amountList", "type": "uint256[]" }
      ],
      "name": "migrateChannelData",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pushChannelAdmin",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
      "name": "reactivateChannel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_newFees", "type": "uint256" }],
      "name": "setChannelDeactivationFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_commAddress", "type": "address" }],
      "name": "setEpnsCommunicatorAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_governanceAddress", "type": "address" }],
      "name": "setGovernanceAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    { "inputs": [], "name": "setMigrationComplete", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
      "inputs": [{ "internalType": "uint256", "name": "_newFees", "type": "uint256" }],
      "name": "setMinChannelCreationFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_newAdmin", "type": "address" }],
      "name": "transferPushChannelAdminControl",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_channel", "type": "address" }],
      "name": "unverifyChannel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_channel", "type": "address" },
        { "internalType": "bytes", "name": "_newIdentity", "type": "bytes" }
      ],
      "name": "updateChannelMeta",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_newAddress", "type": "address" }],
      "name": "updateUniswapRouterAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_newAddress", "type": "address" }],
      "name": "updateWETHAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_channel", "type": "address" }],
      "name": "verifyChannel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  