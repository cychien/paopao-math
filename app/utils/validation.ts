import { z } from "zod";

export const EmailSchema = z
  .string({ required_error: "Email 必填" })
  .email({ message: "Email 格式錯誤" })
  .min(3, { message: "Email 格式錯誤" })
  .max(100, { message: "Email 格式錯誤" })
  // users can type the email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());

export const SchoolNameSchema = z
  .string({ required_error: "學校名稱 必填" })
  .min(3, { message: "學校名稱 格式錯誤" });

export const TempPasswordSchema = z.string({ required_error: "密碼必填" });
