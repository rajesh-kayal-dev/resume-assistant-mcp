import axios from "axios";
import { cache } from "./cache.js";

/**
 * A simple API client to fetch the text content of a job posting url using jina reader.
 */
export class ApiClient {
  private baseUrl = "https://r.jina.ai/";

  async getJobDescription(url: string): Promise<string> {
    const fetchUrl = this.baseUrl + url;
    
    // Check cache first
    const cached = cache.get(fetchUrl);
    if (cached) {
      return cached as string;
    }

    try {
      const response = await axios.get(fetchUrl, {
        headers: {
          "Accept": "text/plain",
          "User-Agent": "Resume-Assistant-MCP/1.5",
        },
        timeout: 10000,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch job description: ${response.status} ${response.statusText}`);
      }

      const text = response.data;
      if (!text || typeof text !== "string") {
        throw new Error("Invalid response from scraper API");
      }

      cache.set(fetchUrl, text);
      return text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error while fetching job description: ${error.message}`);
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
