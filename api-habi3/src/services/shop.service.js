const db = require("../../../util/database");

exports.getShopItemsForUser = async (id) => {
  const query = `
    SELECT s.IDItem, s.name, s.state, s.category, s.price,
           CASE WHEN us.IDUserShop IS NOT NULL THEN 1 ELSE 0 END AS alreadyPurchased
    FROM shop s
    LEFT JOIN userShop us 
           ON s.IDItem = us.IDItem 
          AND us.IDUser = ?
  `;

  const [rows] = await db.execute(query, [id]);
  return rows;
};