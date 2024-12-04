import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const msg = {
      to,
      from: process.env.ADMIN_FROM_EMAIL,
      subject: 'Verify Your Email Address',
      text: `Your OTP for email verification is: ${otp}`,
      html: `<strong>Your OTP for email verification is: ${otp}</strong>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Verification email sent to:', to);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Could not send verification email');
    }
  }

  async sendPasswordResetEmail(to: string, otp: string): Promise<void> {
    const msg = {
      to,
      from: process.env.ADMIN_FROM_EMAIL,
      subject: 'Reset Your Password',
      text: `To reset your password, Please use this otp code: ${otp}`,
      html: `<p>To reset your password, Please use this otp code: ${otp}</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Password reset email sent to:', to);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Could not send password reset email');
    }
  }
}
