export const otpVerificationMessage = (otp: string) => {
  return `<div><img src="https://winlads-api.com/img/win1000ban.png"></img><p>Dear Customer,</p><p>We have received a request to generate a one-time password (OTP) for your Winlads Giveaway Program account. If you did not initiate this request, please disregard this email. 
    <br>
    <br>
    Your one-time password is: ${otp}
    <br>
    <br>
    Please use this OTP to verify your account and ensure the security of your account. 

    <br>
    <br>
    If you have any questions or need further assistance, please don't hesitate to contact our support team at support@winlads.com. 

    <br>
    <br>
    Thank you for being a part of Winlads Giveaway Program.
       <br><br>
    Sincerely, 
   <br>
   <img src="https://winlads-api.com/img/50win.png"></img><br>
   Winlads Team
</p><div>`;
};

export const registerConfirmMessage = (username: string) => {
  return `<div><img src="https://winlads-api.com/img/win1000ban.png"></img><p>Dear ${username},</p><p>We are thrilled to inform you that your registration for the Winlads Giveaway Program has been successfully completed. We are excited to have you on board and look forward to your participation in our upcoming giveaways.
   <br>
   <br>
   As a registered user, you will have the opportunity to participate in various exciting contests and win amazing prizes. Keep an eye on your email for updates on upcoming giveaways and exclusive offers. 
   <br>
   <br>
   Thank you for joining Winlads and being a part of our community. If you have any questions or need further assistance, feel free to reach out to our support team at support@winlads.com
   <br>
   <br>
   Once again, welcome to Winlads and best of luck in our upcoming giveaways! 
   <br>
   <br>
   Sincerely, 
  <br>
  <img src="https://winlads-api.com/img/50win.png"></img><br>
  Winlads Team
</p><div>`;
};
