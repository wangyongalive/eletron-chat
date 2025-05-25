import { BaseProvider } from "./BaseProvider";
import { QianfanProvider } from "./QianfanProvider";
import { OpenAIProvider } from "./OpenAIProvider";

export function createProvider(providerName: string): BaseProvider {
  switch (providerName) {
    case "qianfan":
      return new QianfanProvider(
        process.env.QIANFAN_ACCESS_KEY as string,
        process.env.QIANFAN_SECRET_KEY as string
      );
    case "dashscope":
      return new OpenAIProvider(
        process.env.ALI_API_KEY as string,
        process.env.ALI_BASE_URL as string
      );
    case "deepseek":
      console.log(process.env.DP_API_KEY);
      console.log(process.env.DP_BASE_URL);
      return new OpenAIProvider(
        process.env.DP_API_KEY as string,
        process.env.DP_BASE_URL as string
      );
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}
