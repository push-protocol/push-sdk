import htmlTemplate from './html-template'
import cssTemplate from './css-template'
import Constants from './constants'
import { getRootID, getFirstItemInArray, SDK_LOCAL_STORAGE } from './helpers'
import { ConfigType, MessagePayloadType, NotificationType } from './types'

/**
 * PRIVATE variables
 */

/** keep the config flat as possible  */
const __DEFAULT_CONFIG = {
	isInitialized: false,
	targetID: '', // MANDATORY
	chainId: 1,
	appName: '', // MANDATORY
	user: '', // MANDATORY
	headerText: 'Notifications',
	viewOptions: {
		type: 'sidebar', // ['sidebar', 'modal']
		showUnreadIndicator: true,
		unreadIndicatorColor: '#cc1919',
		unreadIndicatorPosition: 'top-right',
		theme: 'light'
	},
}

// RUNTIME config
let __CONFIG = {} as ConfigType

/**
 * PRIVATE methods
 */
function validateConfig(passedConfig : ConfigType) : boolean {
  if (!passedConfig.user) {
	console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - config.user not passed!`)
	return false
  }

  if (![1, 5].includes(passedConfig.chainId)) {
	console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - config.chainId passed is not in EPNS supported networks [1, 5]!`)
	return false
  }
  if (!passedConfig.targetID) {
	console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - config.targetID not passed!`)
	return false
  }
  if (!passedConfig.appName) {
	console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - config.appName not passed!`)
	return false
  }
  return true
}

function getClonedConfig(passedConfig : ConfigType) : ConfigType {
	let clonedConfig = {} as ConfigType
	const viewOptionsConfig = Object.assign({}, __DEFAULT_CONFIG.viewOptions, passedConfig.viewOptions)
	clonedConfig = Object.assign({}, __DEFAULT_CONFIG, passedConfig)
	clonedConfig.viewOptions = viewOptionsConfig
	return clonedConfig
}

function hideEmbedView() : void {
	const rootID = getRootID(__CONFIG)
	const existingEmbedElements = document.querySelectorAll(`#${rootID}`)
	// remove any existing instances of the embedElement
	if (existingEmbedElements.length > 0) {
		for (let i = 0; i < existingEmbedElements.length; i ++) {
			document.querySelector('body')?.removeChild(existingEmbedElements[i])
		}
	}

	/** this is to remove any outer scroll */
	const bodyElem = document.querySelector('body')

	if (bodyElem !== null) {
		bodyElem.style.overflow = 'visible'
	}
}

function showEmbedView() {
	const rootID = getRootID(__CONFIG);

	hideEmbedView();

	// set up the "embedViewElement"
	const embedViewElement = document.createElement('div');
	embedViewElement.id = rootID;
	embedViewElement.classList.add('epns-sdk-embed-modal', 'epns-sdk-embed-modal-open');
	embedViewElement.innerHTML = htmlTemplate(); // can pass __CONFIG later if needed.

	const bodyElem = document.querySelector('body')

	if (bodyElem !== null) {
		bodyElem.appendChild(embedViewElement)
		bodyElem.style.overflow = 'hidden' // remove any outer scroll
	}

	removeUnreadIndicatorElement();

	// When the user clicks anywhere outside of the modal, close it
	const overlayId = `#${rootID} .epns-sdk-embed-modal-overlay`;
	const overlayElement = document.querySelector(overlayId);

	if (overlayElement !== null) {
		overlayElement.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			hideEmbedView();
		})
	}
}

function setUpEventHandlers() {
	const triggerElement = document.querySelector(`#${__CONFIG.targetID}`);

	if (triggerElement && triggerElement.id === __CONFIG.targetID) {
		console.info(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - click handler attached to #${__CONFIG.targetID}`);

		triggerElement.addEventListener('click', (clickEvent) => {
			clickEvent.preventDefault();
			clickEvent.stopPropagation();
			showEmbedView();
		});
	} else {
		console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - No trigger element ${__CONFIG.targetID} found!`)
	}
}

function removeEventHandlers() : void {
	const triggerElement = document.querySelector(`#${__CONFIG.targetID}`);

	if (triggerElement && triggerElement.id === __CONFIG.targetID) {
		triggerElement.replaceWith(triggerElement.cloneNode(true));
	}
};

function publishToIFRAME(msgPayload : MessagePayloadType) : void {
	const iframeElement = document
		.querySelector(`iframe#${Constants.EPNS_SDK_EMBED_IFRAME_ID}`) as HTMLIFrameElement
	
	try {
		if (iframeElement !== null && iframeElement.contentWindow !== null) {
			iframeElement.contentWindow.postMessage(JSON.stringify(msgPayload), '*');
		} else {
			throw 'Iframe not found!'
		}
	} catch (err) {
		console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - APP to IFRAME publish error'`, err);
	}
}

function subscribeToIFRAME(evt : MessageEvent) : void | null {
	try {
		if (typeof evt.data !== 'string') return null;
		
		const isSDKChannel = !!evt.data.match(Constants.EPNS_SDK_EMBED_CHANNEL);
		if (!isSDKChannel) return null;

		const publishedMsg = JSON.parse(evt.data);
		
		if (publishedMsg.channel === Constants.EPNS_SDK_EMBED_CHANNEL) {
			const { onOpen, onClose, ...sdkConfig } = __CONFIG;

			console.info(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - Received communication from the IFRAME: `, publishedMsg);

			// When the Embed App is loaded.
			if (publishedMsg.topic === Constants.EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_LOADED) {
				const msgPayload = {
					msg: sdkConfig,
					channel: Constants.EPNS_SDK_EMBED_CHANNEL,
					topic: Constants.EPNS_SDK_EMBED_CHANNEL_TOPIC_SDK_CONFIG_INIT
				};

				publishToIFRAME(msgPayload);

				if (typeof onOpen === 'function') {
					onOpen();
				}
			}

			// When the Embed App close button is clicked.
			if (publishedMsg.topic === Constants.EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_CLOSED) {
				hideEmbedView();

				if (typeof onClose === 'function') {
					onClose();
				}
			}
		}
	} catch (err) {
		console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - IFRAME TO APP msg receiving error`, err)
	}
}

function setUpWidget() {	
	// Add event handler to the trigger button 
	if (document.readyState === 'complete') {
		setUpEventHandlers();
	} else {
		window.addEventListener('load', () => {
			setUpEventHandlers();
		})
	}
	
	// attach IFRAME subscription
	window.addEventListener('message', subscribeToIFRAME, false);
}

function insertCSS() {
	const rootID = getRootID(__CONFIG);
	const styleTagId = `${Constants.EPNS_SDK_EMBED_STYLE_TAG_ID_PREFIX}${rootID}`;

	let CSSElement = document.querySelector(
		`style#${styleTagId}`
	);

	if (!CSSElement) {
		const styleEl = document.createElement('style')
		styleEl.id = `${styleTagId}`
		CSSElement = styleEl
	}

	CSSElement.innerHTML = cssTemplate(__CONFIG)

	const headTag = document.querySelector('head')

	if (headTag !== null) {
		headTag.appendChild(CSSElement)
	}
}

function handleUnreadNotifications() {
	// Unread notifications
	if (__CONFIG.viewOptions.showUnreadIndicator) {
		refreshUnreadCount();
	} else {
		removeUnreadIndicatorElement();
	}
}

async function refreshUnreadCount() {
	let count = 0;
	const LS_KEY = 'LAST_NOTIFICATIONS';

	const lastNotifications = await SDK_LOCAL_STORAGE.getLocalStorage(LS_KEY);		
	let latestNotifications = await getUnreadNotifications();

	latestNotifications = latestNotifications.map((notif : NotificationType) => notif.payload_id);

	const lastNotification = getFirstItemInArray(lastNotifications);

	if (lastNotification) {
		const indexOfID = latestNotifications.indexOf(lastNotification);
		if (indexOfID !== -1) { // present
			const latestNotificationsUnread = latestNotifications.slice(0, indexOfID);
			count = latestNotificationsUnread.length;
		}
	} else {
		count = latestNotifications.length;
	}

	SDK_LOCAL_STORAGE.setLocalStorage(LS_KEY, latestNotifications);

	if (count > 0) {
		addUnreadIndicatorElement(count > 9 ? '9+' : count);
	} else {
		removeUnreadIndicatorElement();
	}
}

async function getUnreadNotifications() {
	// call the API here
	try {
		const userInCAIP = `eip155:${__CONFIG.chainId}:${__CONFIG.user}`;
		const apiBaseUrl = Constants.EPNS_SDK_EMBED_API_URL[__CONFIG.chainId];
		const requestUrl = `${apiBaseUrl}/v1/users/${userInCAIP}/feeds?page=1&limit=10&spam=false`;

		const response = await fetch(requestUrl, {
			method: "GET",
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		});

		if (response.ok) {
			const json = await response.json();
			return json.results || [];
		  } else {
			return [];
		  }

	} catch (error) {
		console.error(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - API Error`, error);
		return [];
	}
}

function addUnreadIndicatorElement(count : number | string) {
	removeUnreadIndicatorElement()
	const throbber = document.createElement('div')
	const positionClass = __CONFIG.viewOptions.unreadIndicatorPosition || ''

	throbber.classList.add(
	  'epns-sdk-unread-indicator',
	  `epns-sdk-appname-${__CONFIG.appName}`,
	  positionClass
	)

	throbber.innerText = count.toString();

	const targetElem = document.querySelector(`#${__CONFIG.targetID}`)

	if (targetElem !== null) {
		targetElem.appendChild(throbber)
	}
}

function removeUnreadIndicatorElement() {
	const targetElem = document.querySelector(`#${__CONFIG.targetID}`)

	if (targetElem !== null) {
		const indicator = targetElem.querySelector(
			`.epns-sdk-unread-indicator.epns-sdk-appname-${__CONFIG.appName}`
		)

		if (indicator !== null) {
			targetElem.removeChild(indicator)
		}
	}
}

export const EmbedSDK = {
	init(options: ConfigType) : boolean | undefined {
		if (!__CONFIG.isInitialized) {
			if (!validateConfig(options)) {
				return false;
			}

			__CONFIG = getClonedConfig(options);
			__CONFIG.isInitialized = true;

			setUpWidget();
			insertCSS();
			handleUnreadNotifications();
			console.info(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - CONFIG set`, __CONFIG);
			return true
		}
		return false;
	},
	cleanup() : void {
		if (__CONFIG.isInitialized) {
			hideEmbedView();
			removeEventHandlers();
			window.removeEventListener('message', subscribeToIFRAME, false);
		}
		__CONFIG = <ConfigType>{};

		console.info(`${Constants.EPNS_SDK_EMBED_NAMESPACE} - cleanup called`);
	}
};
