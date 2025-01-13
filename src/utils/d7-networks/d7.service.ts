import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { d7NetworksRequestConfig } from './d7.config';

type D7ApiResponse = {
  status: number;
  message: string;
};

@Injectable()
export class D7NetworksService {
  async sendOTP(phoneNumber: string, otp: string): Promise<D7ApiResponse> {
    try {
      const data = {
        messages: [
          {
            channel: 'sms',
            recipients: [phoneNumber],
            content: `Your OTP for search work is: ${otp}`,
            msg_type: 'text',
            data_coding: 'text',
          },
        ],
        message_globals: {
          originator: 'search-work',
        },
      };

      const config: AxiosRequestConfig = {
        method: 'post',
        url: d7NetworksRequestConfig.apiUrl,
        headers: {
          ...d7NetworksRequestConfig.headers,
          Authorization: d7NetworksRequestConfig.authorization,
        },
        data,
      };

      const response: AxiosResponse<D7ApiResponse> = await axios(config);

      if (response.status === 200) {
        return {
          status: response.status,
          message: 'Otp sent successfully.',
        };
      } else {
        throw new Error(
          `Failed to send OTP. D7 Networks API responded with status ${response.status}`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send OTP. Please try again later.');
    }
  }
}
