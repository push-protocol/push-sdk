import { getRootID } from './helpers'
import Constants from './constants'
import { ConfigType } from './types'

export default function (config: ConfigType) : string {
	// const isDarkTheme = config.viewOptions.theme === 'dark'
  const viewType = config.viewOptions.type || 'sidebar'
	const rootID = getRootID(config)

	return `
        #${rootID}.epns-sdk-embed-modal {
          display: none; /* Hidden by default */
          transition: display 0.5s ease-in-out;
        }

        #${rootID}.epns-sdk-embed-modal.epns-sdk-embed-modal-open {
          display: block;
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: ${Constants.EPNS_SDK_EMBED_CSS_ZINDEX_MAX - 2};
        }

        #${rootID} .epns-sdk-embed-modal-overlay {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-color: #000000bf;
          z-index: ${Constants.EPNS_SDK_EMBED_CSS_ZINDEX_MAX - 2};
        }

        #${rootID} .epns-sdk-embed-modal-content {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: ${Constants.EPNS_SDK_EMBED_CSS_ZINDEX_MAX};
        }

        #${rootID} .epns-sdk-embed-modal-content iframe#${Constants.EPNS_SDK_EMBED_IFRAME_ID} {
          ${viewType === 'sidebar' ? 'width: 450px;' : 'width: 100%;'}
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: none;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
        }  

        #${config.targetID} {
            position: relative;
        }


        /* UNREAD INDICATOR STYLES  */
        #${config.targetID} .epns-sdk-unread-indicator.epns-sdk-appname-${config.appName} {
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${config.viewOptions.unreadIndicatorColor};
            box-shadow: 0 0 0 ${config.viewOptions.unreadIndicatorColor};
            animation: epnsSdkPulse-${config.appName} 2s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #fff;
          }
  
          #${config.targetID} .epns-sdk-unread-indicator.epns-sdk-appname-${config.appName}.top-right {
            right: -10px;
            top: -10px;
          }
  
          #${config.targetID} .epns-sdk-unread-indicator.epns-sdk-appname-${config.appName}.top-left {
            left: -10px;
            top: -10px;
          }
  
          #${config.targetID} .epns-sdk-unread-indicator.epns-sdk-appname-${config.appName}.bottom-left {
            bottom: -10px;
            left: -10px;
          }
          #${config.targetID} .epns-sdk-unread-indicator.epns-sdk-appname-${config.appName}.bottom-right {
            bottom: -10px;
            right: -10px;
          }
  
          @-webkit-keyframes epnsSdkPulse-${config.appName} {
            0% {
              -webkit-box-shadow: 0 0 0 0 ${config.viewOptions.unreadIndicatorColor};
            }
            70% {
                -webkit-box-shadow: 0 0 0 10px #0000;
            }
            100% {
                -webkit-box-shadow: 0 0 0 0 #0000;
            }
          }
          @keyframes epnsSdkPulse-${config.appName} {
            0% {
              -moz-box-shadow: 0 0 0 0 ${config.viewOptions.unreadIndicatorColor};
              box-shadow: 0 0 0 0 ${config.viewOptions.unreadIndicatorColor};
            }
            70% {
                -moz-box-shadow: 0 0 0 10px #0000;
                box-shadow: 0 0 0 10px #0000;
            }
            100% {
                -moz-box-shadow: 0 0 0 0 #0000;
                box-shadow: 0 0 0 0 #0000;
            }
          }
    `
}