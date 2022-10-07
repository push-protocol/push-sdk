/* eslint-disable no-useless-escape */
// @ts-nocheck
import * as FileSystem from 'expo-file-system';

// Download Helper Function
const DownloadHelper = {
  // To get Temp Save Location
  getTempSaveLocation: function (fileURL: string) {
    return (
      FileSystem.documentDirectory +
      DownloadHelper.getSaveFileName(fileURL, true)
    );
  },
  // To get Actual Save Location
  getActualSaveLocation: function (fileURL: string) {
    return (
      FileSystem.documentDirectory +
      DownloadHelper.getSaveFileName(fileURL, false)
    );
  },
  // To get Save File Name
  getSaveFileName: function (fileURL: string, useTempLocation: boolean) {
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
      return fileURL + '.temp';
    } else {
      return fileURL;
    }
  },
  // Determine if media is supported video
  isMediaSupportedVideo: function (fileURL: string) {
    // check if media external embed first
    if (DownloadHelper.isMediaExternalEmbed(fileURL)) {
      return true;
    } else {
      // check if mp4 extension
      if (fileURL.split('.').pop() === 'mp4') {
        return true;
      }
    }

    // if all else fail
    return false;
  },
  // check if media is external embed, like youtube, soundcloud, etc
  isMediaExternalEmbed: function (fileURL: string) {
    return DownloadHelper.isMediaYoutube(fileURL);
  },
  // Determine if youtube
  isMediaYoutube: function (fileURL: string) {
    if (fileURL !== undefined || fileURL !== '') {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = fileURL.match(regExp);
      if (match && match[2] && match[2].length === 11) {
        // embed url
        // const embedURL =
        //   'https://www.youtube.com/embed/' +
        //   match[2] +
        //   '?autoplay=1&enablejsapi=1';
        return true;
      }
    }

    return false;
  },
  // Get youtube id
  getYoutubeID: function (fileURL: string) {
    if (fileURL !== undefined || fileURL !== '') {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = fileURL.match(regExp);
      if (match && match[2] && match[2].length === 11) {
        return match[2];
      }
    }

    return false;
  },
};

export default DownloadHelper;
