const File = require("../model/file");

const router = require("express").Router();

router.get("/:uuid", async (req, res, next) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "No file exists" });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.filesize,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("download", { error: "something went wrong" });
  }
});

module.exports = router;