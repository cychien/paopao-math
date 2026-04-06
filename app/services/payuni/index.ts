import crypto from "node:crypto";

export type PayUniConfig = {
  merId: string;
  hashKey: string;
  hashIv: string;
  isSandbox?: boolean;
  version?: string;
};

type PartialPayUniConfig = Partial<PayUniConfig> & {
  tradeAmt?: number;
  variantAmounts?: Record<string, number>;
};

export type PayUniFormData = {
  action: string;
  fields: {
    MerID: string;
    Version: string;
    EncryptInfo: string;
    HashInfo: string;
  };
  merTradeNo: string;
};

export function generateMerTradeNo() {
  const random = crypto.randomBytes(4).toString("hex");
  return `PM${Date.now()}${random}`.slice(0, 30);
}

function buildPayUniApiBase(isSandbox?: boolean) {
  return isSandbox
    ? "https://sandbox-api.payuni.com.tw/api"
    : "https://api.payuni.com.tw/api";
}

function toQueryString(input: Record<string, string | number>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    params.append(key, String(value));
  }
  return params.toString();
}

function assertCryptoInputs(hashKey: string, hashIv: string) {
  const keyBytes = Buffer.byteLength(hashKey.trim(), "utf8");
  const ivBytes = Buffer.byteLength(hashIv.trim(), "utf8");

  if (keyBytes !== 32) {
    throw new Error("PayUni hashKey must be 32 bytes");
  }

  if (ivBytes !== 16) {
    throw new Error("PayUni hashIv must be 16 bytes");
  }
}

export function encryptInfo(
  payload: Record<string, string | number>,
  hashKey: string,
  hashIv: string,
) {
  assertCryptoInputs(hashKey, hashIv);
  const key = Buffer.from(hashKey.trim(), "utf8");
  const iv = Buffer.from(hashIv.trim(), "utf8");
  const plaintext = toQueryString(payload);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const ciphertextBase64 = encrypted.toString("base64");
  const tagBase64 = cipher.getAuthTag().toString("base64");

  return Buffer.from(`${ciphertextBase64}:::${tagBase64}`, "utf8").toString(
    "hex",
  );
}

export function decryptInfo(encryptInfoHex: string, hashKey: string, hashIv: string) {
  assertCryptoInputs(hashKey, hashIv);
  const key = Buffer.from(hashKey.trim(), "utf8");
  const iv = Buffer.from(hashIv.trim(), "utf8");
  const decoded = Buffer.from(encryptInfoHex, "hex").toString("utf8");
  const [ciphertextBase64, tagBase64] = decoded.split(":::");

  if (!ciphertextBase64 || !tagBase64) {
    throw new Error("Invalid EncryptInfo format");
  }

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextBase64, "base64")),
    decipher.final(),
  ]).toString("utf8");

  const params = new URLSearchParams(plaintext);
  const result: Record<string, string> = {};
  for (const [keyName, value] of params.entries()) {
    result[keyName] = value;
  }

  return result;
}

export function generateHashInfo(encryptInfoHex: string, hashKey: string, hashIv: string) {
  assertCryptoInputs(hashKey, hashIv);
  return crypto
    .createHash("sha256")
    .update(`${hashKey}${encryptInfoHex}${hashIv}`, "utf8")
    .digest("hex")
    .toUpperCase();
}

export function createPayUniUppFormData(
  encryptPayload: Record<string, string | number>,
  config: PayUniConfig,
): PayUniFormData {
  const version = config.version ?? "2.0";
  const encrypted = encryptInfo(encryptPayload, config.hashKey, config.hashIv);
  const hashInfo = generateHashInfo(encrypted, config.hashKey, config.hashIv);

  return {
    action: `${buildPayUniApiBase(config.isSandbox)}/upp`,
    fields: {
      MerID: config.merId,
      Version: version,
      EncryptInfo: encrypted,
      HashInfo: hashInfo,
    },
    merTradeNo: String(encryptPayload.MerTradeNo),
  };
}

export function verifyAndDecryptPayUniResult(
  payload: Record<string, string>,
  config: PayUniConfig,
) {
  const encrypted = payload.EncryptInfo;
  const hashInfo = payload.HashInfo;

  if (!encrypted || !hashInfo) {
    throw new Error("Missing EncryptInfo or HashInfo");
  }

  const expectedHash = generateHashInfo(encrypted, config.hashKey, config.hashIv);
  if (expectedHash !== hashInfo.toUpperCase()) {
    throw new Error("Invalid PayUni hash signature");
  }

  const decrypted = decryptInfo(encrypted, config.hashKey, config.hashIv);
  return {
    outer: payload,
    decrypted,
  };
}

export function isPayUniPaymentSuccessful(data: Record<string, string>) {
  const candidates = [
    data.TradeStatus,
    data.Status,
    data.Result,
    data.PayStatus,
  ].filter(Boolean);

  const normalized = candidates.map((value) => value.trim().toUpperCase());
  return normalized.some((value) =>
    ["1", "SUCCESS", "PAID", "Y", "TRUE", "S"].includes(value),
  );
}

export function extractPayUniEmail(data: Record<string, string>) {
  const fixedCandidates = [
    data.Email,
    data.BuyerEmail,
    data.PayerEmail,
    data.MerchantMemberID,
    data.CustomerEmail,
    data.MemberEmail,
    data.email,
  ];

  const dynamicCandidates = Object.entries(data)
    .filter(([key]) => key.toLowerCase().includes("email"))
    .map(([, value]) => value);

  const candidates = [...fixedCandidates, ...dynamicCandidates];
  return candidates.find((value) => value && value.includes("@")) ?? null;
}

export function extractPayUniName(data: Record<string, string>) {
  const candidates = [data.BuyerName, data.Name, data.PayerName, data.MemberName];
  return candidates.find(Boolean) ?? null;
}

export function resolvePayUniConfig(
  inputConfig?: PartialPayUniConfig | null,
): PayUniConfig | null {
  const merId = process.env.PAYUNI_MER_ID || inputConfig?.merId;
  const hashKey = process.env.PAYUNI_HASH_KEY || inputConfig?.hashKey;
  const hashIv = process.env.PAYUNI_HASH_IV || inputConfig?.hashIv;

  if (!merId || !hashKey || !hashIv) {
    return null;
  }

  return {
    merId,
    hashKey,
    hashIv,
    isSandbox: inputConfig?.isSandbox,
    version: inputConfig?.version,
  };
}
