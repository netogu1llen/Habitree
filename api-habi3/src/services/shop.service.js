const db = require("../../../util/database");
const AWS = require('aws-sdk');

const AWS_BUCKET = process.env.AWS_BUCKET;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  signatureVersion: 'v4',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

exports.getShopItemsForUser = async (id) => {
  const query = `
    SELECT s.IDItem, s.name, s.state, s.category, s.price, s.image_name,
           CASE WHEN us.IDUserShop IS NOT NULL THEN 1 ELSE 0 END AS alreadyPurchased
    FROM shop s
    LEFT JOIN userShop us 
           ON s.IDItem = us.IDItem 
          AND us.IDUser = ?
  `;
  const [rows] = await db.execute(query, [id]);

  // Generar signed URL por cada item
  const itemsWithUrls = await Promise.all(
    rows.map(async (item) => {
      if (!item.image_name) return { ...item, imageUrl: null };

      const params = { Bucket: AWS_BUCKET, Key: item.image_name, Expires: 3600 };
      const signedUrl = s3.getSignedUrl('getObject', params);
      return { ...item, imageUrl: signedUrl };
    })
  );

  return itemsWithUrls;
};