import {
  getAddressStage,
  getCompletedAction,
  getPaymentStage,
  getProductDetails,
} from "../utils/blinkHelpers.js";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { createPostResponse } from "@solana/actions";

const SOLANA_DEVNET_URL = "https://api.devnet.solana.com";
const PYUSD_DEVNET_MINT_ADDRESS =
  "CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM";

const SOLANA_MAINNET_URL =
  "https://wandering-skilled-daylight.solana-mainnet.quiknode.pro/020b08633d653dc1dce09eec6ad348c7fe5fd1c2";
const PYUSD_MAINNET_MINT_ADDRESS =
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";

export async function getStageEmail(req, res) {
  console.log("get stage email");
  console.log(req.url);
  console.log(req.params);
  const merchantUserName = req.params?.merchantUserName;
  const productUUID = req.params?.productUUID;

  let productData = await getProductDetails(merchantUserName, productUUID);
  productData.productPrice = parseFloat(
    productData.productPrice.$numberDecimal
  );
  let queryParams = new URLSearchParams(productData).toString();
  queryParams = `${queryParams}&customerEmail={customerEmail}`;

  const response = {
    type: "action",
    icon: productData.productImageUrl,
    title: productData.productTitle,
    description: productData.productDescription,
    label: "customerEmail",
    links: {
      actions: [
        {
          type: "message",
          label: "Enter Email",
          href: `/api/blinks/newOrder/stageEmail?${queryParams}`,
          parameters: [
            {
              type: "email",
              name: "customerEmail",
              label: "Enter your email for order",
            },
          ],
        },
      ],
    },
  };
  res.status(200).json(response);
}

export async function postStageEmail(req, res) {
  console.log("queryparams received in post stage email");
  console.log(req.query);
  const prevStageDetails = req.query;
  const response = {
    type: "post",
    message: "Customer email added successfully",
    links: {
      next: await getAddressStage(prevStageDetails),
    },
  };
  res.json(response);
}

export async function postStageAddress(req, res) {
  console.log("queryparams received in post stage address");
  console.log(req.query);
  console.log(req.body);
  const prevStageDetails = req.query;
  const response = {
    type: "post",
    message: "Customer address added successfully",
    links: {
      next: await getPaymentStage(prevStageDetails),
    },
  };
  res.json(response);
}

export async function postStagePayment(req, res) {
  console.log("queryparams received in post stage payments");
  console.log(req.query);
  console.log(req.body);
  const connection = new Connection(SOLANA_MAINNET_URL, "confirmed");
  const { account } = req.body;
  const prevStageDetails = req.query;
  const { merchantWalletAddress, productPrice } = prevStageDetails;

  const userPublicKey = new PublicKey(account);
  const merchantPublicKey = new PublicKey(merchantWalletAddress);
  const pyusdMintPublicKey = new PublicKey(PYUSD_MAINNET_MINT_ADDRESS);

  const userTokenAddress = await getAssociatedTokenAddress(
    pyusdMintPublicKey,
    userPublicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const merchantTokenAddress = await getAssociatedTokenAddress(
    pyusdMintPublicKey,
    merchantPublicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const decimals = 6;
  const amount = Math.floor(productPrice * Math.pow(10, decimals));

  const transaction = new Transaction();

  transaction.add(
    createAssociatedTokenAccountIdempotentInstruction(
      userPublicKey, // Payer
      userTokenAddress, // New associated token address
      userPublicKey, // Owner of the new token account
      pyusdMintPublicKey, // Token mint
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  transaction.add(
    createAssociatedTokenAccountIdempotentInstruction(
      userPublicKey, // Payer
      merchantTokenAddress, // New associated token address
      merchantPublicKey, // Owner of the new token account
      pyusdMintPublicKey, // Token mint
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  const transferInstruction = createTransferCheckedInstruction(
    userTokenAddress,
    pyusdMintPublicKey,
    merchantTokenAddress,
    userPublicKey,
    amount,
    6,
    [userPublicKey],
    TOKEN_2022_PROGRAM_ID
  );

  transaction.add(transferInstruction);

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = userPublicKey;

  const response = await createPostResponse({
    fields: {
      type: "transaction",
      transaction: transaction,
      message: `Paying using PyUSD`,
      links: {
        next: await getCompletedAction(prevStageDetails),
      },
    },
  });
  res.json(response);
}
