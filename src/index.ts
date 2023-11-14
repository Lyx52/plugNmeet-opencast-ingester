import {generateAclXML, getConfig, getPostProcessData} from "./utils";
import {OpencastService} from "./services/OpencastService";
import {PlugNMeetService} from "./services/PlugNMeetService";
import {ActiveRoomInfo, PastRoomInfo, Room} from "plugnmeet-sdk-js";
import * as path from "path";
(async () => {
  const config = await getConfig();
  const postProcessingData = getPostProcessData();

  const oc = new OpencastService(config);
  const pnm = new PlugNMeetService(config);
  const series = await oc.getSeries(config.opencast.default_series);
  if (!series && !config.opencast.create_without_series) {
    console.error(`Series ${config.opencast.default_series} does not exist!`);
    process.exit(1);
    return;
  }

  const roomInfo = await pnm.getRoomInfo(postProcessingData) as ActiveRoomInfo | PastRoomInfo;
  if (!roomInfo) {
    console.error(`Room ${postProcessingData.room_sid} does not exist!`);
    process.exit(1);
    return;
  }
  const { metadata } = config.opencast;
  let eventId = '';
  const fileLocation = path.join(config.plugNMeet.recording_location, postProcessingData.file_path)
  const parsedFilePath = path.parse(fileLocation)
  const startTime = new Date(Number(parsedFilePath.name.split("-")[1]));
  if (config.opencast.copy_metadata_from_series) {
    // Creates event using series metadata
    eventId = await oc.createEventMultiRequest({
      location: metadata.location,
      aclName: config.opencast.default_acl,
      contributors: series.contributors ? metadata.contributors.concat(series.contributors) : metadata.contributors,
      creators: series.creators ? metadata.creators.concat(series.creators) : metadata.creators,
      description: metadata.description,
      lang: series.language,
      license: series.license,
      processing: config.opencast.processing_config,
      publishers: series.publishers ? metadata.publishers.concat(series.publishers) : metadata.publishers,
      rights: metadata.rights,
      seriesId: series?.identifier || "",
      started: startTime,
      ended: new Date(),
      subjects: series.subjects ? metadata.subjects.concat(series.subjects) : metadata.subjects,
      title: `${config.opencast.event_title_prefix} '${roomInfo.room_title}'`,
      filePath: fileLocation
    });
  } else {
    // Creates event using configured metadata
    eventId = await oc.createEventMultiRequest({
      location: metadata.location,
      aclName: config.opencast.default_acl,
      contributors: metadata.contributors,
      creators: metadata.creators,
      description: metadata.description,
      lang: metadata.language,
      license: metadata.license,
      processing: config.opencast.processing_config,
      publishers: metadata.publishers,
      rights: metadata.rights,
      seriesId: series?.identifier || "",
      started: startTime,
      ended: new Date(),
      subjects: metadata.subjects,
      title: `${config.opencast.event_title_prefix} '${roomInfo.room_title}'`,
      filePath: fileLocation
    });
  }

  if (config.plugNMeet.delete_when_ingested) {
    await pnm.deleteOldRecording(postProcessingData);
  }
  console.info(`Recording ${postProcessingData.file_path} is ingested, event ${eventId}`);
})();
