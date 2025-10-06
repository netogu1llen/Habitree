const express = require("express")
const router = express.Router()
const isAuth = require('../../util/is-auth');
const shopController = require("../../controllers/shop/shop.controller")


router.get("/shop", isAuth, shopController.getItems)

router.post("/shop", isAuth, shopController.postItem)

router.get("/get_bucket_file/:file", shopController.getBucketFile )

router.get("/get_bucket_url/:file", shopController.getBucketFileUrl )

module.exports = router
