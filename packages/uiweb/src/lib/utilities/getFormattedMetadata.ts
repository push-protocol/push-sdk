import { FrameDetails } from '../types';

export function getFormattedMetadata(URL: string, data: any) {
  let frameType: string;
  const frameDetails: FrameDetails = {
    version: null,
    image: null,
    ogTitle: null,
    ogDescription: null,
    ogType: null,
    siteURL: URL,
    postURL: null,
    buttons: [],
    inputText: null,
    ogImage: null,
    state: null,
    ofProtocolIdentifier: null,
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');

  const metaElements: NodeListOf<HTMLMetaElement> = doc.head.querySelectorAll('meta');
  const fcTags: string[] = [];
  const ofTags: string[] = [];
  const ogTags: string[] = [];

  metaElements.forEach((element) => {
    const name = element.getAttribute('name') ?? element.getAttribute('property');
    switch (name) {
      case 'fc:frame':
      case 'fc:frame:image':
        fcTags.push(name);
        break;
      case 'of:version':
      case 'of:accepts:push':
      case 'of:image':
        ofTags.push(name);
        break;
      case 'og:image':
        ogTags.push(name);
        if (!ofTags.some((tag) => tag === 'og:image')) {
          ofTags.push(name);
        }
        if (!fcTags.some((tag) => tag === 'og:image')) {
          fcTags.push(name);
        }
        break;
      case 'og:title':
      case 'og:description':
        ogTags.push(name);
        break;
      default:
        break;
    }
  });

  if (ofTags.includes('of:version') && ofTags.includes('of:image') && ofTags.includes('of:accepts:push')) {
    frameType = 'of';
    metaElements.forEach((element) => {
      const name = element.getAttribute('name') || element.getAttribute('property');
      const content = element.getAttribute('content');
      if (name === 'og:image') {
        frameDetails.ogImage = content as string;
      }
      if (name && content && name.startsWith('of:')) {
        const index = name.split(':')[2];
        switch (name) {
          case 'og:title':
            frameDetails.ogTitle = content;
            break;
          case 'og:description':
            frameDetails.ogDescription = content;
            break;
          case 'og:type':
            frameDetails.ogType = content;
            break;
          case 'of:version':
            frameDetails.version = content;
            break;
          case 'of:image':
            frameDetails.image = content;
            break;
          case 'of:post_url':
            frameDetails.postURL = content;
            break;
          case 'of:input:text':
            frameDetails.inputText = content;
            break;
          case 'of:state':
            frameDetails.state = content;
            break;
          case `of:button:${index}`:
          case `of:button:${index}:action`:
          case `of:button:${index}:target`: {
            let type: 'action' | 'target' | 'content' = name.split(':').pop() as 'action' | 'target' | 'content';

            const buttonIndex = frameDetails.buttons.findIndex((button) => button.index === index);
            if (buttonIndex !== -1) {
              if (type === index) type = 'content';
              frameDetails.buttons[buttonIndex][type] = content;
            } else {
              frameDetails.buttons.push({
                index,
                content: '',
                action: '',
                target: undefined,
              });
              if (type === index) type = 'content';
              frameDetails.buttons[frameDetails.buttons.length - 1][type] = content;
            }
            break;
          }
          default:
            break;
        }
      }
    });
  } else if (fcTags.includes('fc:frame') && fcTags.includes('fc:frame:image')) {
    frameType = 'fc';

    metaElements.forEach((element) => {
      const name = element.getAttribute('name') || element.getAttribute('property');

      const content = element.getAttribute('content');
      if (name === 'og:image') {
        frameDetails.ogImage = content as string;
      }
      if (name && content && name.startsWith('fc:frame')) {
        const index = name.split(':')[3];

        switch (name) {
          case 'og:title':
            frameDetails.ogTitle = content;
            break;
          case 'og:description':
            frameDetails.ogDescription = content;
            break;
          case 'og:type':
            frameDetails.ogType = content;
            break;
          case 'fc:frame':
            frameDetails.version = content;
            break;
          case 'fc:frame:image':
            frameDetails.image = content;
            break;
          case 'fc:frame:post_url':
            frameDetails.postURL = content;
            break;
          case 'fc:frame:input:text':
            frameDetails.inputText = content;
            break;
          case 'fc:frame:state':
            frameDetails.state = content;
            break;
          case `fc:frame:button:${index}`:
          case `fc:frame:button:${index}:action`:
          case `fc:frame:button:${index}:target`:
          case `fc:frame:button:${index}:post_url`: {
            let type: 'action' | 'target' | 'content' | 'post_url' = name.split(':').pop() as
              | 'action'
              | 'target'
              | 'content';
            const buttonIndex = frameDetails.buttons.findIndex((button) => button.index === index);
            if (buttonIndex !== -1) {
              if (type === index) type = 'content';
              frameDetails.buttons[buttonIndex][type] = content;
            } else {
              frameDetails.buttons.push({
                index,
                content: '',
                action: '',
                target: undefined,
                post_url: undefined,
              });

              if (type === index) type = 'content';
              frameDetails.buttons[frameDetails.buttons.length - 1][type] = content;
            }
            break;
          }
          default:
            break;
        }
      }
    });
  } else if (ogTags.includes('og:image')) {
    frameType = 'og';
    metaElements.forEach((element) => {
      const name = element.getAttribute('name') || element.getAttribute('property');
      const content = element.getAttribute('content');

      if (name && content && name.startsWith('og:')) {
        switch (name) {
          case 'og:image':
            frameDetails.ogImage = content as string;
            break;
          case 'og:title':
            frameDetails.ogTitle = content;
            break;
          case 'og:description':
            frameDetails.ogDescription = content;
            break;
          case 'og:type':
            frameDetails.ogType = content;
            break;
        }
      }
    });
  } else {
    frameType = 'unsupported';

    return { isValidFrame: false, frameType, message: 'Not a valid Frame' };
  }
  frameDetails.buttons.sort((a, b) => parseInt(a.index) - parseInt(b.index));

  return { isValidFrame: true, frameType, frameDetails };
}
