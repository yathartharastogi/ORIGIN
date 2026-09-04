import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

import connectDB from "../config/db.js";

import Transaction from "../models/Transaction.js";
import GatewayRecord from "../models/GatewayRecord.js";
import BankRecord from "../models/BankRecord.js";
import LedgerRecord from "../models/LedgerRecord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_DATA_DIR = path.resolve(
  __dirname,
  "../../mock-data"
);

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const records = [];

    const filePath = path.join(MOCK_DATA_DIR, filename);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push(row);
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const parseDate = (value) => {
  if (!value || value.trim() === "") {
    return null;
  }

  return new Date(value);
};

const parseMetadata = (value) => {
  if (!value || value.trim() === "") {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const transformTransactions = (rows) => {
  return rows.map((row) => ({
    transactionId: row.transactionId,
    amount: Number(row.amount),
    currency: row.currency,
    paymentMethod: row.paymentMethod,
    merchantId: row.merchantId,
    customerReference: row.customerReference,
    transactionStatus: row.transactionStatus,
    transactionTimestamp: parseDate(row.transactionTimestamp),
  }));
};

const transformGatewayRecords = (rows) => {
  return rows.map((row) => ({
    transactionId: row.transactionId,
    gatewayReference: row.gatewayReference,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    processedAt: parseDate(row.processedAt),
    responseCode: row.responseCode,
    responseMessage: row.responseMessage,
    metadata: parseMetadata(row.metadata),
  }));
};

const transformBankRecords = (rows) => {
  return rows.map((row) => ({
    transactionId: row.transactionId,
    bankReference: row.bankReference,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    settlementBatchId: row.settlementBatchId,
    receivedAt: parseDate(row.receivedAt),
    settledAt: parseDate(row.settledAt),
    responseCode: row.responseCode || null,
    responseMessage: row.responseMessage || null,
    metadata: parseMetadata(row.metadata),
  }));
};

const transformLedgerRecords = (rows) => {
  return rows.map((row) => ({
    transactionId: row.transactionId,
    ledgerReference: row.ledgerReference,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    postedAt: parseDate(row.postedAt),
    entryType: row.entryType,
    accountReference: row.accountReference,
    metadata: parseMetadata(row.metadata),
  }));
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("Reading CSV files...");

    const [
      transactionRows,
      gatewayRows,
      bankRows,
      ledgerRows,
    ] = await Promise.all([
      readCSV("transactions.csv"),
      readCSV("gateway_records.csv"),
      readCSV("bank_records.csv"),
      readCSV("ledger_records.csv"),
    ]);

    console.log(
      `Transactions CSV: ${transactionRows.length}`
    );

    console.log(
      `Gateway CSV: ${gatewayRows.length}`
    );

    console.log(
      `Bank CSV: ${bankRows.length}`
    );

    console.log(
      `Ledger CSV: ${ledgerRows.length}`
    );

    const transactions =
      transformTransactions(transactionRows);

    const gatewayRecords =
      transformGatewayRecords(gatewayRows);

    const bankRecords =
      transformBankRecords(bankRows);

    const ledgerRecords =
      transformLedgerRecords(ledgerRows);

    console.log("Clearing existing mock data...");

    await Promise.all([
      Transaction.deleteMany({}),
      GatewayRecord.deleteMany({}),
      BankRecord.deleteMany({}),
      LedgerRecord.deleteMany({}),
    ]);

    console.log("Inserting data...");

    await Transaction.insertMany(transactions);
    await GatewayRecord.insertMany(gatewayRecords);
    await BankRecord.insertMany(bankRecords);
    await LedgerRecord.insertMany(ledgerRecords);

    console.log("Database seeded successfully.");

    console.log({
      transactions: transactions.length,
      gatewayRecords: gatewayRecords.length,
      bankRecords: bankRecords.length,
      ledgerRecords: ledgerRecords.length,
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedDatabase();

