import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    merchantUserName: {
      type: String,
      required: true,
    },
    merchantWalletAddress: {
      type: String,
      required: true,
    },
    merchantEmail: {
      type: String,
      required: true,
    },
    productUUID: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productImageUrl: {
      type: String,
      required: true,
    },
    productPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: function (value) {
          // Convert value to string, split at decimal point, and check decimal length
          const decimalPart = value.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 4;
        },
        message: (props) =>
          `${props.value} must have up to 4 decimal places only.`,
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
