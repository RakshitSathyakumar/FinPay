"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import FinPayHackNewUser from "@/models/userModel";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcyrpt from "bcrypt";
import cookie, { serialize } from "cookie";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
// export const getUserInfo = async ({ userId }: getUserInfoProps) => {
//   try {
//     const uri: string = process.env.MONGO_URI!;
//     mongoose
//       .connect(uri, {
//         dbName: "amazonnn",
//       })
//       .then((c) => console.log(`DB Connected to ${c.connection.host}`))
//       .catch((e) => console.log(e));

//     const user = await FinPayHackNewUser.findById(userId);
//     return parseStringify(user);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
  }
};

// export const signIn = async ({ email, password }: signInProps) => {
//   const uri: string = process.env.MONGO_URI!;
//   mongoose
//     .connect(uri, {
//       dbName: "amazonnn",
//     })
//     .then((c) => console.log(`DB Connected to ${c.connection.host}`))
//     .catch((e) => console.log(e));

//   const user = await FinPayHackNewUser.findOne({ email });
//   if (!user) {
//     throw new Error("Invalid email or password");
//   }

//   const isPasswordMatch = await bcyrpt.compare(password, user.password);
//   if (!isPasswordMatch) {
//     throw new Error("Invalid email or password");
//   }

//   // Set up session (simplified example, consider using a library like next-auth)
//   const sessionToken = jwt.sign(
//     { userId: user._id, email: user.email },
//     "appwrite-session",
//     { expiresIn: "1h" }
//   );

//   // Set the cookie
//   const cookie = serialize("appwrite-session", JSON.stringify(sessionToken), {
//     path: "/",
//     httpOnly: true,
//     sameSite: "strict",
//     maxAge: 60 * 60 * 24 * 7, // 1 week
//   });
//   cookies().set("appwrite-session", sessionToken, {
//     path: "/",
//     httpOnly: true,
//     sameSite: "strict",
//     secure: true,
//   });
//   return parseStringify(user);
// };

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if(!newUserAccount) throw new Error('Error creating user')

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal'
    })

    if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl
      }
    )

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error', error);
  }
}

// export const signUp = async ({ password, ...userData }: SignUpParams) => {
//   const { email, firstName, lastName } = userData;

//   try {
//     // Hash password
//     const uri: string = process.env.MONGO_URI!;
//     mongoose
//       .connect(uri, {
//         dbName: "amazonnn",
//       })
//       .then((c) => console.log(`DB Connected to ${c.connection.host}`))
//       .catch((e) => console.log(e));

//     const hashedPassword = await bcyrpt.hash(password, 10);
//     console.log(hashedPassword);
//     const dwollaCustomerUrl = await createDwollaCustomer({
//       ...userData,
//       type: "personal",
//     });

//     if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

//     const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

//     const newUser = new FinPayHackNewUser({
//       password: hashedPassword,
//       userId: new mongoose.Types.ObjectId(),
//       dwollaCustomerId,
//       dwollaCustomerUrl,
//       ...userData,
//     });

//     // // Update user with Dwolla info
//     // newUserAccount.dwollaCustomerId = dwollaCustomerId;
//     // newUserAccount.dwollaCustomerUrl = dwollaCustomerUrl;
//     await newUser.save();

//     // Create session token (using JWT here for simplicity)
//     const sessionToken = jwt.sign(
//       { userId: newUser._id, email: newUser.email },
//       "appwrite-session",
//       { expiresIn: "1h" }
//     );

//     const cookieHeader = cookie.serialize("appwrite-session", sessionToken, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//       maxAge: 3600, // 1 hour
//     });

//     cookies().set("appwrite-session", sessionToken, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     console.log("Set-Cookie:", cookieHeader);
//     console.log(newUser);
//     return parseStringify(newUser);
//   } catch (error) {
//     console.error("Error", error);
//     throw new Error(error.message);
//   }
// };

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
