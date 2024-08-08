const mentionedTemplate = (
	username: string,
	task: string,
	mentionedBy: string,
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
    <p style='color: #D8D8D8; font-size: 48px; text-align:center; font-weight: bold;line-height: 46px; '>Hello ${uppercaseUsername}!</p>
    <p style='color: #D8D8D8; text-align:center;font-size: 24px'>You've been mentioned by ${mentionedBy} on task ${task}</p>
       </div>
        <div style='text-align: center;'>
    <img src='cid:sqBg' alt='squared-background' />
    
       </div>
  </div>
  `;
};

export default mentionedTemplate;
