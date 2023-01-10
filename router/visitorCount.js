const express = require('express');
const router = express.Router();
let visitorCount = 0;

router.get('/viscounter', async(req,res)=>{
    visitorCount++;
    res.send({ visitorCount });

})

module.exports = router;