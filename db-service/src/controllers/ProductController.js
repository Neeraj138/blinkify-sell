import Product from "../models/products.js";

export const addProduct = async (req, res) => {
  try {
    const {
      merchantUserName,
      merchantWalletAddress,
      merchantEmail,
      productUUID,
      productName,
      productTitle,
      productDescription,
      productImageUrl,
      productPrice,
    } = req.body;
    if (
      !merchantUserName ||
      !merchantWalletAddress ||
      !merchantEmail ||
      !productUUID ||
      !productName ||
      !productTitle ||
      !productDescription ||
      !productImageUrl ||
      !productPrice
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newProduct = new Product({
      merchantUserName,
      merchantWalletAddress,
      merchantEmail,
      productUUID,
      productName,
      productTitle,
      productDescription,
      productImageUrl,
      productPrice,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { productUUID, merchantUserName } = req.query;
    const filter = {};

    if (productUUID) {
      filter.productUUID = productUUID;
    }
    if (merchantUserName) {
      filter.merchantUserName = merchantUserName;
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};
