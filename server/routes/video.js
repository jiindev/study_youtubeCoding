const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
let ffmpeg = require('fluent-ffmpeg');

let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowd'), false);
        }
        cb(null, true);
    }
});

const upload = multer({storage:storage}).single('file');

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res)=>{
    //비디오를 서버에 저장!
    upload(req, res, err=>{
        if(err){
            return res.json({success:false, error});
        }
        return res.json({success:true, url:res.req.file.path, fileName : res.req.file.filename})
    })
});

router.post('/uploadVideo', (req, res)=>{
    //비디오 정보들을 저장
    const video = new Video(req.body);
    video.save((err, doc)=>{
        if(err) return res.json({success: false, err});
        res.status(200).json({success: true});
    })
})

router.get('/getVideos', (req, res)=>{
    //비디오를 db에서 가져와서 클라이언트에 보낸다.
    Video.find()
        .populate('writer')
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })
})
router.post('/getVideoDetail', (req, res)=>{
    //비디오를 db에서 가져와서 클라이언트에 보낸다.
    Video.findOne({"_id":req.body.videoId})
        .populate('writer')
        .exec((err, videoDetail)=>{
            console.log(videoDetail);
            if(err) return res.status(400).send(err);
            res.status(200).json({success:true, videoDetail})
        })
})

router.post('/thumbnail', (req, res)=>{
   //섬네일 생성 하고 비디오 러닝타임도 가져오기
   let filePath = "";
   let fileDuration = "";
   
   //비디오 정보 가져오기
   ffmpeg.ffprobe(req.body.url, (err, metadata)=>{
       console.log(metadata);
       console.log(metadata.format.duration);
       fileDuration = metadata.format.duration
   });

   //섬네일 생성
   ffmpeg(req.body.url)
   .on('filenames', (filenames)=>{
       console.log('Will generate'+filenames.join(','));
       console.log(filenames);
       filePath = "uploads/thumbnails/"+filenames[0]
   })
   .on('end', ()=>{
       console.log('Screenshots taken');
       return res.json({success:true, url:filePath, fileDuration:fileDuration})
   })
   .on('error', (err)=>{
       console.error(err);
       return res.json({success:false, err});
   })
   .screenshots({
       count:3,
       folder:'uploads/thumbnails',
       size:'320x240',
       filename: 'thumbnail-%b.png'
   })
})


module.exports = router;
