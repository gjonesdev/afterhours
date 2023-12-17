import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

export const upload = multer({ storage });


/*import util from 'util';
//import { multer } from 'multer';
//import { multer } from 'multer-gridfs-storage';
//import * as GridFsStorage from "multer-gridfs-storage";
//const { GridFsStorage } = require("multer-gridfs-storage");
import { GridFsStorage } from 'multer-gridfs-storage';
//import * as mongoConfig from '../config/settings.js';
import { mongoConfig } from '../config/settings.js';

import pkg from 'multer';
const { multer } = pkg;


var storage = new GridFsStorage({
  url: mongoConfig.serverUrl ,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-afterhours-${file.originalname}`;
      return filename;
    }

    return {
      folderName: "bars",
      filename: `${Date.now()}-afterhours-${file.originalname}`
    };
  }
});

var uploadFiles = multer({ storage }).array("multi-files", 10);
var uploadPhotos = util.promisify(uploadFiles);
module.exports = uploadPhotos;*/