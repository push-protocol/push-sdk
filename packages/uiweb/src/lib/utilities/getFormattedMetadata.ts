import { FrameDetails } from '../types';

export function getFormattedMetadata(URL: string, data: any) {
  let frameType: string;
  const frameDetails: FrameDetails = {
    version: '',
    image: '',
    siteURL: URL,
    postURL: '',
    buttons: [],
    inputText: undefined,
    ogImage: '',
    state: undefined,
    ofProtocolIdentifier: undefined,
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');

  const metaElements: NodeListOf<HTMLMetaElement> =
    doc.head.querySelectorAll('meta');
  const fcTags: string[] = [];
  const ofTags: string[] = [];
  metaElements.forEach((element) => {
    const name =
      element.getAttribute('name') ?? element.getAttribute('property');
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
        if (!ofTags.some((tag) => tag === 'og:image')) {
          ofTags.push(name);
        }
        if (!fcTags.some((tag) => tag === 'og:image')) {
          fcTags.push(name);
        }
        break;
      default:
        break;
    }
  });

  if (
    ofTags.includes('of:version') &&
    ofTags.includes('og:image') &&
    ofTags.includes('of:image') &&
    ofTags.includes('of:accepts:push')
  ) {
    frameType = 'of';
    metaElements.forEach((element) => {
      const name =
        element.getAttribute('name') || element.getAttribute('property');
      const content = element.getAttribute('content');
      if (name === 'og:image') {
        frameDetails.ogImage = content as string;
      }
      if (name && content && name.startsWith('of:')) {
        const index = name.split(':')[2];
        switch (name) {
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
            let type: 'action' | 'target' | 'content' = name
              .split(':')
              .pop() as 'action' | 'target' | 'content';

            const buttonIndex = frameDetails.buttons.findIndex(
              (button) => button.index === index
            );
            if (buttonIndex !== -1) {
              if (type === index) type = 'content';
              frameDetails.buttons[buttonIndex][type] = content;
            } else {
              frameDetails.buttons.push({
                index,
                content: '',
                action: '',
                target: '',
              });
              if (type === index) type = 'content';
              frameDetails.buttons[frameDetails.buttons.length - 1][type] =
                content;
            }
            break;
          }
          default:
            break;
        }
      }
    });
  } else if (
    fcTags.includes('fc:frame') &&
    fcTags.includes('fc:frame:image') &&
    fcTags.includes('og:image')
  ) {
    frameType = 'fc';
    metaElements.forEach((element) => {
      const name =
        element.getAttribute('name') || element.getAttribute('property');
      const content = element.getAttribute('content');
      if (name === 'og:image') {
        frameDetails.ogImage = content as string;
      }
      if (name && content && name.startsWith('fc:frame')) {
        const index = name.split(':')[3];

        switch (name) {
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
            let type: 'action' | 'target' | 'content' | 'post_url' = name
              .split(':')
              .pop() as 'action' | 'target' | 'content';
            const buttonIndex = frameDetails.buttons.findIndex(
              (button) => button.index === index
            );
            if (buttonIndex !== -1) {
              if (type === index) type = 'content';
              frameDetails.buttons[buttonIndex][type] = content;
            } else {
              frameDetails.buttons.push({
                index,
                content: '',
                action: '',
                target: '',
                post_url: undefined,
              });

              if (type === index) type = 'content';
              frameDetails.buttons[frameDetails.buttons.length - 1][type] =
                content;
            }
            break;
          }
          default:
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
