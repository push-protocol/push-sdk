/* eslint-disable no-useless-escape */
// Download Helper Function
export const MediaHelper = {
  // validate a CTA
  validURL: function(str : string | undefined){
    if(!str) return false;
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\S*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  },
  // To get Save File Name
  getSaveFileName: function(fileURL: string, useTempLocation: string) {
    // Remove all http, https protocols first
    fileURL = fileURL.replace(/(^\w+:|^)\/\//, '');

    // /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi
    // Remove all special characters
    fileURL = fileURL.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');

    // Remove all but 250 characters
    if (fileURL.length > 250) {
      fileURL = fileURL.substr(-250);
    }

    if (useTempLocation) {
      return fileURL+ '.temp';
    }
    else {
      return fileURL;
    }
  },
  // Determine if media is supported video
  isMediaSupportedVideo: function(fileURL:string | undefined) {
    if(!fileURL) return;
    // check if media external embed first
    const mediaURL = MediaHelper.isMediaExternalEmbed(fileURL);
    if (mediaURL) {
      return mediaURL;
    }
    else {
      // check if mp4 extension
      if (fileURL.split('.').pop() === "mp4") {
        return true;
      }
    }

    // if all else fail
    return false;
  },
  // check if media is external embed, like youtube, soundcloud, etc
  isMediaExternalEmbed: function(fileURL: string) {
    return (MediaHelper.isMediaYoutube(fileURL));
  },
  // Determine if youtube
  isMediaYoutube: function(fileURL : string) {
    if (fileURL !== undefined || fileURL !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = fileURL.match(regExp);
        if (match && match[2].length === 11) {
          // embed url
          const embedURL = 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0&enablejsapi=1';
          return embedURL;
        }
    }
    return "";
  },
  // Get youtube id
  getYoutubeID: function(fileURL: string) {
    if (fileURL !== undefined || fileURL !== '') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        const match = fileURL.match(regExp);
        if (match && match[2].length === 11) {
          return match[2];
        }
    }

    return "";
  }
}


