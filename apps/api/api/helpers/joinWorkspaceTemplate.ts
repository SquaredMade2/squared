const joinWorkspaceTemplate = (
	username: string,
	verificationUrl: string,
	workspaceName?: string,
) => {
	const uppercaseUsername = username[0].toUpperCase() + username.slice(1);

	return `
<div style='background:#0C0C0C; margin: 0 auto; padding: 20px 50px;'>
<div style='padding: 15px 30px; width: 800px; margin: 0 auto;'>
<div style='display: flex; align-items: center; '>
<div style='display: flex; align-items: center;  margin: 0 auto;'>
  <img src="cid:sqLogo" alt='squared-logo' style='width: 32px; height: 32px; margin-right: 10px;' /> 
  <span style='font-size: 20px; font-weight: bold;color: #D8D8D8;'>SQUARED</span>
  </div>
  </div>
    <p style='color: #D8D8D8; font-size: 48px; text-align:center; font-weight: bold;line-height: 46px; '>Welcome Aboard, ${uppercaseUsername}!</p>
    <p style='color: #D8D8D8; text-align:center;'>You've been exclusively invited to join ${workspaceName}! This is a unique opportunity to collaborate, share ideas, and grow with a community of like-minded individuals. Click below to confirm your participation and start exploring your new workspace.</p>
    <div style='display: flex; justify-content: center; align-items: center;'>
      <a style="min-width:150px;background:#174EFF;border-radius:8px;padding:15px 21px;text-align:center;align-self: center;font-weight: bold; margin:40px auto;font-size:18px;font-weight:700;color:#D8D8D8;display:inline-block;text-decoration:none;line-height:120%;" href='${verificationUrl}'>Join ${workspaceName}</a>
    </div>
    <div style='text-align: center;'>
    <img src='cid:sqBg' alt='squared-background' />
      <p style='color: #D8D8D8; font-size: 12px;'>By joining ${workspaceName}, you're stepping into a world of innovation and collaboration. Don't miss out on this chance to connect and create with your peers. <a  style='text-decoration: none;' href='https://squaredmade.com'>Learn More</a>.</p>
      </div>
       </div>
  </div>
  `;
};

export default joinWorkspaceTemplate;
