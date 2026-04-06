/**
 * 白名單用戶 - 這些 email 不需要驗證 AppCustomer（私下購買的用戶）
 */
const whitelistedEmails: string[] = [
  // 在這裡加入私下購買用戶的 email
  // "example@gmail.com",
];

const normalizedSet = new Set(whitelistedEmails.map((e) => e.toLowerCase()));

export function isWhitelistedEmail(email: string): boolean {
  return normalizedSet.has(email.toLowerCase());
}
