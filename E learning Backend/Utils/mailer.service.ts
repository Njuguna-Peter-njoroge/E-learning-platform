/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

export interface EmailOptions {
    to: string;
    subject: string;
    template?: string;
    context?: Record<string, any>;
    html?: string;
    text?: string;
}

export interface WelcomeEmailContext {
    name: string;
    email: string;
    companyName?: string;
    supportEmail?: string;
    loginUrl?: string;
}

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);

    constructor(
        private mailerService: NestMailerService,
        private configService: ConfigService,
    ) {}

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions: any = {
                to: options.to,
                subject: options.subject,
            };

            if (options.template && options.context) {
                mailOptions.template = options.template;
                mailOptions.context = options.context;
            } else if (options.html) {
                mailOptions.html = options.html;
            } else if (options.text) {
                mailOptions.text = options.text;
            }

            const result = await this.mailerService.sendMail(mailOptions);
            this.logger.log(
                `Email sent successfully to ${options.to}: ${result.messageId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to send email to ${options.to}: ${error.message}`,
            );
            throw error;
        }
    }

    async sendWelcomeEmail(email: string, name: string, otpCode: string): Promise<void> {
        const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to E-Learning Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .otp-box { background: #fff; border: 2px solid #4CAF50; padding: 15px; text-align: center; margin: 20px 0; }
                    .otp-code { font-size: 24px; font-weight: bold; color: #4CAF50; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to E-Learning Platform</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>Welcome to our E-Learning Platform! We're excited to have you on board.</p>
                        <p>To complete your registration, please use the verification code below:</p>
                        
                        <div class="otp-box">
                            <p>Your verification code:</p>
                            <div class="otp-code">${otpCode}</div>
                        </div>
                        
                        <p>This code will expire in 10 minutes for security reasons.</p>
                        <p>If you didn't create an account with us, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Welcome to E-Learning Platform - Verify Your Email',
            html: htmlContent,
        });
    }

    async sendPasswordResetEmail(email: string, name: string, otpCode: string): Promise<void> {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Password Reset - E-Learning Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #f44336; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .otp-box { background: #fff; border: 2px solid #f44336; padding: 15px; text-align: center; margin: 20px 0; }
                    .otp-code { font-size: 24px; font-weight: bold; color: #f44336; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>We received a request to reset your password for your E-Learning Platform account.</p>
                        <p>Use the verification code below to reset your password:</p>
                        
                        <div class="otp-box">
                            <p>Your reset code:</p>
                            <div class="otp-code">${otpCode}</div>
                        </div>
                        
                        <p>This code will expire in 10 minutes for security reasons.</p>
                        <p>If you didn't request a password reset, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Password Reset - E-Learning Platform',
            html: htmlContent,
        });
    }

    async sendEmailVerification(email: string, name: string, otpCode: string): Promise<void> {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Email Verification - E-Learning Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .otp-box { background: #fff; border: 2px solid #2196F3; padding: 15px; text-align: center; margin: 20px 0; }
                    .otp-code { font-size: 24px; font-weight: bold; color: #2196F3; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Verification</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>Please verify your email address to complete your registration.</p>
                        <p>Use the verification code below:</p>
                        
                        <div class="otp-box">
                            <p>Your verification code:</p>
                            <div class="otp-code">${otpCode}</div>
                        </div>
                        
                        <p>This code will expire in 10 minutes for security reasons.</p>
                        <p>If you didn't create an account with us, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Email Verification - E-Learning Platform',
            html: htmlContent,
        });
    }

    async sendCourseEnrollmentEmail(email: string, name: string, courseName: string): Promise<void> {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Course Enrollment - E-Learning Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Course Enrollment Confirmation</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${name}!</h2>
                        <p>You have successfully enrolled in the course: <strong>${courseName}</strong></p>
                        <p>You can now access your course materials and start learning!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: `Course Enrollment - ${courseName}`,
            html: htmlContent,
        });
    }

    async sendCourseCompletionEmail(email: string, name: string, courseName: string): Promise<void> {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Course Completion - E-Learning Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .footer { text-align: center; padding: 20px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Course Completion!</h1>
                    </div>
                    <div class="content">
                        <h2>Congratulations ${name}!</h2>
                        <p>You have successfully completed the course: <strong>${courseName}</strong></p>
                        <p>Your certificate will be available in your dashboard shortly.</p>
                        <p>Keep up the great work and continue learning!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: `Course Completion - ${courseName}`,
            html: htmlContent,
        });
    }
}