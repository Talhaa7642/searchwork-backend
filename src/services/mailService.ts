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
      from: process.env.FROM_EMAIL, // Use your SendGrid verified sender email
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

  async sendPasswordResetEmail(to: string): Promise<void> {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject: 'Reset Your Password',
      text: `Click on the following link to reset your password`,
      html: `<p>Click on the following link to reset your password</p>`,
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
