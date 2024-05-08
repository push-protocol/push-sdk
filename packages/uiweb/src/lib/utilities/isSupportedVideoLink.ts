export function isSupportedVideoLink(link: string): boolean {
  const supportedVideoLinks = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'facebook.com',
    'soundcloud.com',
    'mux.com',
    'wistia.com',
    'mixcloud.com',
    'dailymotion.com',
  ];

  return supportedVideoLinks.some((domain) => link.includes(domain));
}
