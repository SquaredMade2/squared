import { Router, Request, Response } from 'express';
import axios from 'axios';

const oauthRoutes = Router();
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = 'http://localhost:5173/oauth/github/callback';

oauthRoutes.get('/github', (req: Request, res: Response) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  res.redirect(githubAuthUrl);
});

oauthRoutes.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = response.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to retrieve access token' });
    }

    res.redirect(`http://localhost:3000/workspace/work/settings/integrations/github?token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default oauthRoutes;
