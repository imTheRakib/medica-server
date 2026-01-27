export const verificationEmailTemplate = (verificationUrl: any) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          
          <tr>
            <td style="background-color:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">Verify Your Email</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px;">Hi,</p>

              <p style="font-size:16px; line-height:1.6;">
                Thanks for signing up! Please verify your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                  style="background-color:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:14px; word-break:break-all;">
                <a href="${verificationUrl}" style="color:#4f46e5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="font-size:14px; color:#666;">
                If you did not create this account, you can ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f4f4f4; padding:15px; text-align:center;">
              <p style="font-size:12px; color:#999; margin:0;">
                © 2025 Your App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
