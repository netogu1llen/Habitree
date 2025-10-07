const { response } = require('express');
const Item = require('../../models/Shop/shop.model');

const AWS = require('aws-sdk');

const AWS_BUCKET = process.env.AWS_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

AWS.config.update({
  signatureVersion: 'v4',
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

async function generateSignedUrls(items) {
  return await Promise.all(items.map(async (item) => {
    const params = {
      Bucket: AWS_BUCKET,
      Key: item.image_name,
      Expires: 3600
    };
    const signedUrl = s3.getSignedUrl('getObject', params);
    return {
      ...item,
      imageUrl: signedUrl
    };
  }));
}

//  Obtener todos los items
exports.getItems = async (req, res) => {
  try {
    const [items] = await Item.fetchAll();
    const itemsWithUrls = await generateSignedUrls(items);

    res.render('Shop/shop', { 
      title: 'Shop',
      items: itemsWithUrls,
      csrfToken: req.csrfToken()
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading shop items");
  }
};

// Filtrar items
exports.filterItems = async (req, res) => {
  try {
    const {state, category, minPrice, maxPrice} = req.query;

    const filters = {};
    if (state) filters.state = state;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
   

    const [items] = await Item.fetchFiltered(filters);
    const itemsWithUrls = await generateSignedUrls(items);

    res.json({
      success: true,
      data: itemsWithUrls
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error filtering items"
    });
  }
};

// Obtener opciones de filtro
exports.getFilterOptions = async (req, res) => {
  try {
    const [categories] = await Item.getUniqueCategories();
    const [states] = await Item.getUniqueStates();
    const [priceRange] = await Item.getPriceRange();

    res.json({
      success: true,
      data: {
        categories: categories.map(c => c.category),
        states: states.map(s => s.state),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching filter options"
    });
  }
};
