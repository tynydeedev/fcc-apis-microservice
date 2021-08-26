const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const date = Date.now();
    const suffix = Math.round(Math.random() * 10000000);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${date}-${name}-${suffix}${ext}`);
  }
});

const upload = multer({ storage: storage })

// Router
router.post('/fileanalyse', upload.single('upfile'), (req, res) => {
  console.log(req.file);

  const fileName = req.file.originalname;
  const fileType = req.file.mimetype;
  const fileSize = req.file.size;

  return res.json({
    name: fileName,
    type: fileType,
    size: fileSize
  });
})


module.exports = router;