import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  email: string;
  name: string;
  token: string;
}

/**
 * 发送邮箱验证邮件
 */
export async function sendVerificationEmail({
  email,
  name,
  token,
}: SendVerificationEmailParams) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '验证你的邮箱 - Randomizer',
      html: `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>验证邮箱</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #000000;">
                        🎲 Randomizer
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #000000;">
                        你好，${name}！
                      </h2>
                      
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                        感谢你注册 Randomizer！点击下面的按钮验证你的邮箱地址：
                      </p>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${verifyUrl}" 
                               style="display: inline-block; padding: 14px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                              验证邮箱
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        或者复制以下链接到浏览器：
                      </p>
                      
                      <p style="margin: 10px 0 0; padding: 12px; background-color: #f5f5f5; border-radius: 4px; font-size: 12px; color: #666666; word-break: break-all;">
                        ${verifyUrl}
                      </p>
                      
                      <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        <strong>注意：</strong>此链接将在 <strong>24小时</strong> 后过期。
                      </p>
                      
                      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #999999;">
                        如果你没有注册 Randomizer，请忽略此邮件。
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5; background-color: #fafafa; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        © ${new Date().getFullYear()} Randomizer. All rights reserved.
                      </p>
                      <p style="margin: 10px 0 0; font-size: 12px; color: #999999;">
                        这是一封自动发送的邮件，请勿直接回复。
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail({
  email,
  name,
  token,
}: SendVerificationEmailParams) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '重置密码 - Randomizer',
      html: `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>重置密码</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #000000;">
                        🎲 Randomizer
                      </h1>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #000000;">
                        你好，${name}！
                      </h2>
                      
                      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                        我们收到了你的密码重置请求。点击下面的按钮设置新密码：
                      </p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${resetUrl}" 
                               style="display: inline-block; padding: 14px 40px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                              重置密码
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                        <strong>注意：</strong>此链接将在 <strong>1小时</strong> 后过期。
                      </p>
                      
                      <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #999999;">
                        如果你没有请求重置密码，请忽略此邮件，你的密码不会被更改。
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5; background-color: #fafafa; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; font-size: 12px; color: #999999;">
                        © ${new Date().getFullYear()} Randomizer. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send password reset email');
    }

    console.log('Password reset email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
