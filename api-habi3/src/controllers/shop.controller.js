const shopService = require("../services/shop.service");

const getShopItemsForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const items = await shopService.getShopItemsForUser(id);

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error("❌ Error in getShopItemsForUser:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shop items"
    });
  }
};

module.exports = { getShopItemsForUser };