// controllers/shop/shop.controller.js
const path = require('path');
const fs = require('fs');
const upload = require('../../config/multer.config');
const AWS = require('aws-sdk');
const Item = require('../../models/shop/shop.model');

// Configurar AWS S3
const AWS_BUCKET = process.env.AWS_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION

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

    res.render('shop/shop', { 
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
exports.getBucketFile = async(req, res, next) => {
    const filename = req.params.file;
    console.log('========== GET BUCKET FILE ==========');
    console.log('Filename solicitado:', filename);
    console.log('AWS_BUCKET:', AWS_BUCKET);
    
    const opciones = {
        Bucket: AWS_BUCKET,
        Key: filename,
    };
    
    console.log('Opciones S3:', opciones);

    s3.getObject(opciones, function(err, data) {
        if (err) {
            console.error('ERROR al obtener archivo de S3:');
            console.error('Error Code:', err.code);
            console.error('Error Message:', err.message);
            console.error('Status Code:', err.statusCode);
            return res.status(404).json({
                code: 404,
                msg: 'File not found',
                error: err.message,
                errorCode: err.code
            });
        }
        
        console.log('Archivo obtenido exitosamente');
        console.log('Content-Type:', data.ContentType);
        console.log('Content-Length:', data.ContentLength);
        
        res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(data.Body);
    });
};

// Generar URL firmada (signed URL) para acceso temporal
exports.getBucketFileUrl = async(req, res, next) => {
    const filename = req.params.file;
    
    const params = {
        Bucket: AWS_BUCKET,
        Key: filename,
        Expires: 3600 // URL válida por 1 hora
    };
    
    try {
        const url = s3.getSignedUrl('getObject', params);
        res.json({
            url: url,
            filename: filename,
            expiresIn: 3600
        });
    } catch (err) {
        console.error('Error generating signed URL:', err);
        res.status(500).json({
            code: 500,
            msg: 'Error generating URL',
            error: err.message
        });
    }
};

exports.postItem = async (req, res, next) => {
  console.log("Cargando el archivo");

  const uploadMiddleware = upload.array('file', 1);

  uploadMiddleware(req, res, async function (err) {
    if (err) {
      console.error("❌ Error en multer:", err);
      return res.status(400).json({
        code: 400,
        msg: "Error uploading file."
      });
    }

    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 400,
        msg: "No file uploaded"
      });
    }

    const filePath = path.join(__dirname, '../../bucket', req.files[0].filename);
    const fileName = req.files[0].filename;

    try {
      // Leer el archivo local
      const fileData = fs.readFileSync(filePath);

      // Subir a S3
      const params = {
        Bucket: AWS_BUCKET,
        Key: fileName,
        Body: fileData,
      };

      const s3Result = await s3.upload(params).promise();
      console.log(`Archivo subido exitosamente a S3: ${s3Result.Location}`);

      // Eliminar el archivo local
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("No se pudo borrar archivo local:", unlinkErr);
      });

      // Guardar en la base de datos
      const addItem = new Item(
        req.body.name,
        req.body.state,
        req.body.category,
        req.body.price,
        fileName
      );

      await addItem.save();
      console.log("Item guardado en base de datos");

      // Redirigir al finalizar todo
      return res.json({
        success: true,
        msg: "Item agregado exitosamente",
        redirect: "/shop"
      });

    } catch (error) {
      console.error("❌ Error en postItem:", error);
      return res.status(500).json({
        code: 500,
        msg: "Error processing request",
        error: error.message
      });
    }
  });
};

exports.toggleItemState = async (req, res) => {
  const { id } = req.body;

  try {
    // Obtener el estado actual del item
    const [rows] = await Item.getStatus(Number(id));

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item no encontrado' });
    }

    const currentState = Number(rows[0].state);
    console.log('Estado actual del item:', currentState);
    let result;
    let actionMessage;

    if (currentState === 1) {
      // Si está activo, desactivarlo
      [result] = await Item.deactivate(Number(id));
      actionMessage = 'Item desactivado correctamente';
    } else {
      // Si está inactivo, activarlo
      [result] = await Item.activate(Number(id));
      actionMessage = 'Item activado correctamente';
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: actionMessage
      });
    } else {
      return res.status(404).json({ success: false, message: 'No se pudo actualizar el estado del item' });
    }

  } catch (error) {
    console.error('Error al cambiar estado del item:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
