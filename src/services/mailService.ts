import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is missing from environment variables');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const fromEmail = process.env.ADMIN_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('ADMIN_FROM_EMAIL is missing from environment variables');
    }

    const msg = {
      to,
      from: fromEmail,
      subject: 'Verify Your Email Address',
      text: `Your OTP for email verification is: ${otp}`,
      html: `<strong>Your OTP for email verification is: ${otp}</strong>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Verification email sent to:', to);
    } catch (error) {
      console.error('Error sending verification email:', error.response?.body?.errors || error.message);
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

  async sendEmployerNotificationEmail(
    employerEmail: string,
    jobTitle: string,
    jobSeekerName: string,
  ): Promise<void> {
    const msg = {
      to: employerEmail,
      from: process.env.ADMIN_FROM_EMAIL,
      subject: `New Application for Your Job Post: ${jobTitle}`,
      text: `You have received a new application for your job post "${jobTitle}" from ${jobSeekerName}.`,
      html: `<p>You have received a new application for your job post <strong>${jobTitle}</strong> from <strong>${jobSeekerName}</strong>.</p>`,
    };
  
    try {
      await sgMail.send(msg);
      console.log('Employer notification email sent to:', employerEmail);
    } catch (error) {
      console.error('Error sending employer notification email:', error);
      throw new Error('Could not send employer notification email');
    }
  }
  
  async sendJobSeekerConfirmationEmail(
    jobSeekerEmail: string,
    jobTitle: string,
  ): Promise<void> {
    const msg = {
      to: jobSeekerEmail,
      from: process.env.ADMIN_FROM_EMAIL,
      subject: `Application Confirmation for Job: ${jobTitle}`,
      text: `You have successfully applied to the job "${jobTitle}".`,
      html: `<p>You have successfully applied to the job <strong>${jobTitle}</strong>.</p>`,
    };
  
    try {
      await sgMail.send(msg);
      console.log('Job seeker confirmation email sent to:', jobSeekerEmail);
    } catch (error) {
      console.error('Error sending job seeker confirmation email:', error);
      throw new Error('Could not send job seeker confirmation email');
    }
  }

  async sendApplicationViewedNotification(
    jobSeekerEmail: string,
    jobTitle: string,
  ): Promise<void> {
    const msg = {
      to: jobSeekerEmail,
      from: process.env.ADMIN_FROM_EMAIL,
      subject: `Your Application Has Been Viewed`,
      text: `The employer has viewed your application for the job "${jobTitle}".`,
      html: `<p>The employer has viewed your application for the job <strong>${jobTitle}</strong>.</p>`,
    };
  
    try {
      await sgMail.send(msg);
      console.log('Application viewed notification email sent to:', jobSeekerEmail);
    } catch (error) {
      console.error('Error sending application viewed email:', error);
      throw new Error('Could not send application viewed email');
    }
  }
  
  
}
