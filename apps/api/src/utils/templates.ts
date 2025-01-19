const NEXT_PUBLIC_CONFIRM_URL = process.env.NEXT_PUBLIC_CONFIRM_URL;

export const joinWorkspaceTemplate = ({
	username,
	path,
	workspaceName,
}: {
	username?: string;
	path: string;
	workspaceName?: string;
}) => {
	const uppercaseUsername =
		username && username[0].toUpperCase() + username.slice(1);
	const verificationUrl = `${NEXT_PUBLIC_CONFIRM_URL}/${path}`;

	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Chivo:wght@400;700&display=swap');
        body { font-family: 'Chivo', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #174EFF; padding: 20px; text-align: center; }
        .content { padding: 30px; color: #333333; }
        .button { display: inline-block; padding: 12px 24px; background-color: #174EFF; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:sqLogo" alt="SQUARED" style="width: 32px; height: 32px; vertical-align: middle;" />
          <span style="color: #ffffff; font-size: 24px; font-weight: bold; vertical-align: middle; margin-left: 10px;">SQUARED</span>
        </div>
        <div class="content">
          <h1 style="color: #174EFF; font-size: 28px; margin-bottom: 20px;">Welcome Aboard${uppercaseUsername ? `, ${uppercaseUsername}` : ""}!</h1>
          <p>You've been exclusively invited to join ${workspaceName}! This is a unique opportunity to collaborate, share ideas, and grow with a community of like-minded individuals.</p>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${verificationUrl}" class="button">Join ${workspaceName}</a>
          </p>
          <p style="margin-top: 30px; font-size: 14px;">By joining ${workspaceName}, you're stepping into a world of innovation and collaboration. Don't miss out on this chance to connect and create with your peers.</p>
        </div>
        <div class="footer">
          <img src="cid:sqBg" alt="SQUARED Background" style="max-width: 100%; height: auto; margin-bottom: 20px;" />
          <p>&copy; 2024 SQUARED. All rights reserved. | <a href="https://squaredmade.com" style="color: #174EFF; text-decoration: none;">Learn More</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
