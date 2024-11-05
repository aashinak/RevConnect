const emailFormat = (otp: number, userName: string): string => {
  const format = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; background-color: #4CAF50; padding: 10px; border-radius: 8px 8px 0 0; color: white; font-size: 24px;">
          OTP Verification
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #555;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #555;">We received a request to access your account. Use the OTP code below to complete your verification:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background-color: #f0f0f0; display: inline-block; padding: 10px 20px; margin-top: 20px; color: #333;">${otp}</div>
          <p style="font-size: 16px; margin-top: 20px; color: #555;">This OTP is valid for the next 5 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
          <p>Thank you for using our service!</p>
          <p>Need help? <a href="mailto:revconnecthelp@gmail.com" style="color: #4CAF50; text-decoration: none;">Contact support</a></p>
        </div>
      </div>
    </body>
    </html>`;
  return format;
};

export default emailFormat;
