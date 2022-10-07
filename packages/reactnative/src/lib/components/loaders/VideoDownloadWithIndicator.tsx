// @ts-nocheck
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import * as FileSystem from "expo-file-system";

import Video from "react-native-video";
import YouTube from "react-native-youtube";

import ProgressCircle from "react-native-progress-circle";
import { EPNSActivity } from "./EPNSActivity";

import DownloadHelper from "../DownloadHelper";

import GLOBALS from "../../globals";

const MAX_ATTEMPTS = 3;


export type VideoDownloadWithIndicatorProps = {
  style: any;
  fileURL: string;
  resizeMode?: string;
  youTubeAPIKey: string;
};

type VideoDownloadWithIndicatorState = {
  indicator: boolean;
  downloading: boolean;
  downloadProgress: number;
  fileURI: string;
  attemptNumber: number;
  defaulted: boolean;
};


class VideoDownloadWithIndicator extends Component <VideoDownloadWithIndicatorProps, VideoDownloadWithIndicatorState> {
  // CONSTRUCTOR
  constructor(props: VideoDownloadWithIndicatorProps) {
    super(props);

    this.state = {
      indicator: false,
      downloading: true,
      downloadProgress: 0,
      fileURI: "",

      attemptNumber: 0,
      defaulted: false,
    };

    // Set Mounted
    this._isMounted = false;
  }

  // COMPONENT MOUNTED
  componentDidMount() {
    // Start Operation
    this._isMounted = true;
    this.checkAndInitiateOperation(this.props.fileURL);
  }

  // COMPONENT UPDATED
  componentDidUpdate(prevProps) {
    // Check for prop change
    if (this.props.fileURL !== prevProps.fileURL) {
      this.setState({
        indicator: true,
        downloading: true,
        downloadProgress: 0,
        fileURI: "",
      });

      this.checkAndInitiateOperation(this.props.fileURL);
    }
  }

  // COMPONENT UNMOUNTED
  componentWillUnmount() {
    this._isMounted = false;
  }

  // FUNCTIONS
  // Check
  checkAndInitiateOperation = async (fileURL) => {
    if (DownloadHelper.isMediaExternalEmbed(fileURL)) {
      // Do Nothing, this is already loaded media
      this.setState({
        indicator: false,
        downloading: false,
        downloadProgress: "100%",
        fileURI: fileURL,
      });

      return;
    }

    const localFileURI = DownloadHelper.getActualSaveLocation(fileURL);
    const localFileInfo = await FileSystem.getInfoAsync(localFileURI);

    if (localFileInfo.exists) {
      if (this._isMounted) {
        this.setState({
          indicator: false,
          downloading: false,
          downloadProgress: 100,
          fileURI: localFileURI,
        });
      }

      // console.log("File Exists on: |" + localFileURI + "|");
    } else {
      if (this.state.attemptNumber <= MAX_ATTEMPTS) {
        if (this._isMounted) {
          this.setState({
            indicator: false,
            downloading: true,
            downloadProgress: 0,
            attemptNumber: this.state.attemptNumber + 1,
          });
        }

        await this.startDownload(fileURL);
      } else {
        // Image can't be retrieved, Display bad image
        this.setState({
          indicator: false,
          downloading: false,
          downloadProgress: "100%",
          fileURI: require('../../assets/frownface.png'),
          defaulted: true,
        });
      }
    }
  };

  // To Start Download
  startDownload = async (fileURL) => {
    const localFileTempURI = DownloadHelper.getTempSaveLocation(fileURL);

    // Create File Download
    const downloadResumable = FileSystem.createDownloadResumable(
      fileURL,
      localFileTempURI,
      {},
      (dwProg) => {
        const progress =
          dwProg.totalBytesWritten / dwProg.totalBytesExpectedToWrite;
        const progressPerc = Number((progress * 100).toFixed(2));
        //console.log("Progress for " + fileURL + ": " + progressPerc);

        if (this._isMounted) {
          this.setState({
            downloadProgress: progressPerc,
          });
        }
      }
    );

    // Initiate
    try {
      const { uri } = await downloadResumable.downloadAsync();
      // console.log("MOVING");
      // console.log(uri);
      // console.log(DownloadHelper.getActualSaveLocation(fileURL));

      // Download completed, move file to actual location
      try {
        await FileSystem.moveAsync({
          from: uri,
          to: DownloadHelper.getActualSaveLocation(fileURL),
        });
      } catch (e) {
        console.warn(e);
      }

      // Go Back to check and initiate operation
      await this.checkAndInitiateOperation(fileURL);
    } catch (e) {
      console.warn(e);
    }
  };

  // on video bufferring
  onBuffer = (response) => {
    // console.log('onBuffer: ', response);
  };

  // When Errored
  videoError = (error) => {
    // console.log("Error on playback" + error);

    this.setState({
      indicator: false,
      downloading: false,
      downloadProgress: "100%",
      fileURI: require('../../assets/frownface.png'),
      defaulted: true,
    });
  };

  // handle on press
  onPress = () => {
    // console.log("here");
    this.player.presentFullscreenPlayer();

    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  // RENDER
  render() {
    const {
      style,
      miniProgressLoader,
      margin,
      resizeMode,
    } = this.props;

    const contentContainerStyle = {};
    if (margin) {
      contentContainerStyle.margin = margin;
    }

    let modifiedResizeMode = resizeMode;
    if (this.state.defaulted) {
      modifiedResizeMode = "center";
    }

    return (
      <TouchableWithoutFeedback
        style={[styles.container]}
        onPress={() => {
          this.onPress(this.state.fileURI);
        }}
        disabled={true}
      >
        <View style={[styles.innerContainer, style]}>
          <View style={[styles.contentContainer, contentContainerStyle]}>
            {this.state.indicator ? (
              <EPNSActivity style={styles.activity} size="small" />
            ) : this.state.downloading ? (
              <View style={styles.downloading}>
                {miniProgressLoader === true ? (
                  <EPNSActivity style={styles.activity} size="small" />
                ) : (
                  <ProgressCircle
                    percent={this.state.downloadProgress}
                    radius={20}
                    borderWidth={20}
                    color={GLOBALS.COLORS.GRADIENT_SECONDARY}
                    shadowColor={GLOBALS.COLORS.LIGHT_GRAY}
                    bgColor={GLOBALS.COLORS.WHITE}
                  ></ProgressCircle>
                )}
              </View>
            ) : this.state.defaulted === true ? (
              <Image
                style={styles.image}
                source={require('../../assets/frownface.png')}
                resizeMode={modifiedResizeMode}
              />
            ) : DownloadHelper.isMediaExternalEmbed(this.state.fileURI) ===
              false ? (
              <Video
                source={{ uri: `${this.state.fileURI}` }}
                ref={(ref) => {
                  this.player = ref;
                }}
                onBuffer={this.onBuffer}
                onError={this.videoError}
                style={styles.backgroundVideo}
                resizeMode="cover"
                controls={true}
                paused={true}
                allowFullScreen={true}
              />
            ) : (
              <YouTube
                videoId={DownloadHelper.getYoutubeID(this.state.fileURI)}
                apiKey={this.props.youTubeAPIKey}
                play={false}
                fullscreen={false}
                loop={false}
                controls={1}
                onReady={(e) => this.setState({ isReady: true })}
                onChangeState={(e) => this.setState({ status: e.state })}
                onChangeQuality={(e) => this.setState({ quality: e.quality })}
                onError={(e) => this.setState({ error: e.error })}
                style={styles.backgroundVideo}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  innerContainer: {
    flex: 1,
    height: "100%",
    overflow: "hidden",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    width: "100%",
    overflow: "hidden",
  },
  downloading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 40,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export {
  VideoDownloadWithIndicator
}