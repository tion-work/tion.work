import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class JWTDecoderTool extends BaseTool {
  id = "jwt-decoder";
  name = "JWT 解码器";
  description = "解码和验证 JWT Token，查看头部和载荷信息";
  category: ToolCategory = "security";
  icon = "shield";
  color = "bg-blue-500";
  inputType: InputType = "text";
  outputType: OutputType = "json";
  inputLanguage = undefined;
  inputPlaceholder = "请输入 JWT Token...";
  outputLanguage = "json";
  initialInput =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  options = [];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "JWT Decoder",
        description:
          "Decode and validate JWT tokens, view header and payload information",
        inputPlaceholder: "Please enter JWT token...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "JWTデコーダー",
        description:
          "JWTトークンをデコード・検証し、ヘッダーとペイロード情報を表示",
        inputPlaceholder: "JWTトークンを入力してください...",
        options: [],
      };
    }

    return {
      name: this.name,
      description: this.description,
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",
      options: [],
    };
  }

  async process(input: string, options: any = {}): Promise<string> {
    try {
      return this.decodeJWT(input);
    } catch (error) {
      throw new Error(
        `JWT 解码失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    // 简单的 JWT 格式验证
    const parts = input.trim().split(".");
    return parts.length === 3;
  }

  private decodeJWT(token: string): string {
    const parts = token.trim().split(".");

    if (parts.length !== 3) {
      throw new Error("无效的 JWT 格式");
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    try {
      // 解码头部
      const header = this.base64UrlDecode(headerPart);
      const headerObj = JSON.parse(header);

      // 解码载荷
      const payload = this.base64UrlDecode(payloadPart);
      const payloadObj = JSON.parse(payload);

      // 检查过期时间
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payloadObj.exp && payloadObj.exp < now;

      // 检查生效时间
      const isNotYetValid = payloadObj.nbf && payloadObj.nbf > now;

      const result = {
        header: {
          raw: headerPart,
          decoded: headerObj,
          algorithm: headerObj.alg || "unknown",
          type: headerObj.typ || "JWT",
        },
        payload: {
          raw: payloadPart,
          decoded: payloadObj,
          issuedAt: payloadObj.iat
            ? new Date(payloadObj.iat * 1000).toISOString()
            : null,
          expiresAt: payloadObj.exp
            ? new Date(payloadObj.exp * 1000).toISOString()
            : null,
          notBefore: payloadObj.nbf
            ? new Date(payloadObj.nbf * 1000).toISOString()
            : null,
          issuer: payloadObj.iss || null,
          subject: payloadObj.sub || null,
          audience: payloadObj.aud || null,
          jwtId: payloadObj.jti || null,
        },
        signature: {
          raw: signaturePart,
          algorithm: headerObj.alg || "unknown",
        },
        validation: {
          isExpired: isExpired,
          isNotYetValid: isNotYetValid,
          isValidFormat: true,
          canVerify: false, // 需要密钥才能验证签名
        },
        raw: {
          token: token,
          parts: {
            header: headerPart,
            payload: payloadPart,
            signature: signaturePart,
          },
        },
      };

      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(
        `解码失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  private base64UrlDecode(str: string): string {
    // 添加填充
    str += "=".repeat((4 - (str.length % 4)) % 4);

    // 替换 URL 安全字符
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    try {
      return atob(str);
    } catch (error) {
      throw new Error("Base64 解码失败");
    }
  }
}
