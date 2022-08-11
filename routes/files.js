const router = require("express").Router();
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const File = require("../model/file");

/* --------------Multer Configuration-------------- */
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

/*----------------------------------------------------------- */
let upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    // validate request

    if (!req.file) {
      res.status(400).json({
        error: "error,file required",
      });
    }

    // store file
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();

    // response link
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

/* --------------------send Mail------------- */
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).json({
      error: "All fields required",
    });
  }
  // get data from db

  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).json({ error: "Email already sent" });
  }
  // emailFrom, downloadLink, size, expires

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();
  // email send
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "file share",
    text: `${emailFrom} shared a file with you`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: `${parseInt(file.size / 1000)} kb`,
      expires: "24 hours",
    }),
  });
});

module.exports = router;
