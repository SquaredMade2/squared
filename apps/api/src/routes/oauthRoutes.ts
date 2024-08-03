import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = process.env.GITHUB_REDIRECT_URI;

router.get('/github', (req: Request, res: Response) => {
  console.log('Received request at /oauth/github'); // Debugging statement
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  console.log('Received request at /oauth/github/callback with code:', code); // Debugging statement

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = response.data;
    console.log('Received access token:', access_token); // Debugging statement

    // Save the access token in your database linked to the logged-in user
    // Redirect to the application or handle the response as needed
    res.redirect(`http://localhost:3000/success?token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
