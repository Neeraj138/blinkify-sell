import dotenv from "dotenv";
dotenv.config();

export async function getProductDetails(merchantUserName, productUUID) {
  const params = new URLSearchParams({
    merchantUserName,
    productUUID,
  });

  const query = `${process.env.DB_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(query);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return {};
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

export async function getAddressStage(prevStageDetails) {
  let productData = prevStageDetails;
  let queryParams = new URLSearchParams(productData).toString();
  queryParams = `${queryParams}&customerAddress={customerAddress}`;
  return {
    type: "inline",
    action: {
      icon: productData.productImageUrl,
      title: productData.productTitle,
      description: productData.productDescription,
      label: "customerAddress",
      links: {
        actions: [
          {
            type: "message",
            label: "Enter Delivery Address",
            href: `/api/blinks/newOrder/stageAddress?${queryParams}`,
            parameters: [
              {
                type: "textarea",
                name: "customerAddress",
                label: "Enter your delivery address",
              },
            ],
          },
        ],
      },
    },
  };
}

export async function getPaymentStage(prevStageDetails) {
  let productData = prevStageDetails;
  let queryParams = new URLSearchParams(productData).toString();
  return {
    type: "inline",
    action: {
      icon: productData.productImageUrl,
      title: productData.productTitle,
      description: productData.productDescription,
      label: "Payment",
      links: {
        actions: [
          {
            type: "transaction",
            label: `Pay $${productData.productPrice} using PyUSD`,
            href: `/api/blinks/newOrder/stagePayment?${queryParams}`,
          },
        ],
      },
    },
  };
}

export async function getCompletedAction(prevStageDetails) {
  let productData = prevStageDetails;
  return {
    type: "inline",
    action: {
      icon: productData.productImageUrl,
      title: productData.productTitle,
      description: "Order Placed",
      label: "Order has been placed.",
      type: "completed",
    },
  };
}
