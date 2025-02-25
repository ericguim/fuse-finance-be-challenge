import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';

export interface FuseStock {
  symbol: string;
  price: number;
  available: number;
}

export interface FuseStocksResponse {
  status: number;
  data: {
    items: FuseStock[];
    nextToken?: string;
  };
}

@Injectable()
export class FuseApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.FUSE_API_BASE_URL,
      headers: {
        'x-api-key': process.env.FUSE_API_KEY,
      },
    });
  }

  async getStocks(nextToken?: string): Promise<FuseStocksResponse> {
    try {
      const response = await this.client.get<FuseStocksResponse>('/stocks', {
        params: nextToken ? { nextToken } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stocks from Fuse API:', error);
      throw error;
    }
  }

  async buyStock(symbol: string, price: number, quantity: number) {
    try {
      const response = await this.client.post(`/stocks/${symbol}/buy`, {
        price,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error('Error buying stock from Fuse API:', error);
      throw error;
    }
  }
}
