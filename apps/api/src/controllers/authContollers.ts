import 'dotenv/config';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { hashPassword, comparePassword } from '../helpers/auth';
import AppError from '../utils/AppError';
import User from '../models/user';
import JwtPayload from '../interface/JWTPayload';
import { sendMail } from '../helpers/transporter';
import Workspace from '../models/workspace';

const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

// endpoint: /register
const registerUser = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	try {
		const { name, email, password, username } = req.body;
		if (!name) {
			return res.status(422).json({
				error: 'name is required',
			});
		}

		if (!email) {
			return res.status(422).json({
				error: 'Email is required',
			});
		}

		if (!password || password.length < 6) {
			return res.status(422).json({
				error: 'Password is required. It should be at least 6 characters long',
			});
		}

		const exist = await User.findOne({ email });
		if (exist) {
			return res.status(422).json({
				error: 'This email is already registered',
			});
		}

		const hashedPassword = await hashPassword(password);

		const user = await User.create({
			name,
			username,
			email,
			password: hashedPassword,
			date: Date.now(),
			verified: false,
		});
		jwt.sign(
			{
				user: user._id,
			},
			process.env.JWT_SECRECT,
			{ expiresIn: '1d' },
			(err, emailToken) => {
				sendMail(email, user.username, emailToken, 'confirmation');
			}
		);
		return res.status(201).json({
			success: true,
			message: `Sent a verification email to ${email}`,
		});
	} catch (error) {
		
		return res.status(500).json({ error: 'Server Error' });
	}
};

// endpoint: /login
const loginUser = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	try {
		const { email, password } = req.body;
		let passwordMatch;

		if (!email || !password) {
			return res.status(422).json({
				error: 'Email and password are required.',
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(422).json({
				error: 'No user found, please register.',
			});
		} else {
			passwordMatch = await comparePassword(password, user.password);
		}

		if (!user.verified) {
			jwt.sign(
				{
					user: user._id,
				},
				process.env.JWT_SECRECT,
				{ expiresIn: '1d' },
				(err, emailToken) => {
					sendMail(email, user.username, emailToken, 'confirmation');
				}
			);
			return res.status(422).json({
				error:
					'Your email is not verified. Link has been sent to your email to verify',
			});
		}

		if (passwordMatch) {
			jwt.sign(
				{
					email: user.email,
					id: user._id,
					name: user.name,
					defaultWorkspace: user.default_workspace,
					lastLogin: user.last_login,
					workspaces: user.workspaces,
				},
				process.env.JWT_SECRECT,
				{},
				async (error, token) => {
					if (error) throw error;
					res.cookie('token', token);

					if (!user.on_boarding) {
						// if user signed in but did not complete onboarding
						return res.json({
							user,
							redirectTo: '/onboarding',
						});
					} else {
						//otherwise look for workspace, all the workspaces are deleted, send back to /onboarding
						await user.populate('workspaces');
						const workspace = user.workspaces[0];
						if (!workspace) {
							return res.json({
								user,
								redirectTo: '/onboarding',
							});
						}
						return res.json({
							user,
							redirectTo: workspace.url,
						});
					}
				}
			);
			return;
		} else {
			res.status(422).json({
				error: 'Incorrect Password',
			});
		}
	} catch (error) {
		
		return res.status(500).json({ error: 'Server Error' });
	}
};

const verifyEmail = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { token } = req.params;
	if (!token) {
		res.status(422).send({ message: 'Missing token' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRECT) as JwtPayload;
		const user = await User.findOne({ _id: decoded.user });
		if (!user) {
			return res.status(404).json({ message: 'User does not exists' });
		}
		user.verified = true;
		user.save();
		res.status(200).json({
			success: true,
			message: 'Account has been verified',
			redirect: '/login',
		});
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const signInUsingNextAuth = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(422).json({
				error: 'No user found, please register.',
			});
		}
		if (!user.verified) {
			jwt.sign(
				{
					user: user._id,
				},
				process.env.JWT_SECRECT,
				{ expiresIn: '1d' },
				(err, emailToken) => {
					sendMail(email, user.username, emailToken, 'confirmation');
				}
			);
			return res.status(422).json({
				error:
					'Your email is not verified. Link has been sent to your email to verify',
			});
		}

		jwt.sign(
			{
				email: user.email,
				id: user._id,
				name: user.name,
				defaultWorkspace: user.default_workspace,
				lastLogin: user.last_login,
				workspaces: user.workspaces,
			},
			process.env.JWT_SECRECT,
			{},
			async (error, token) => {
				if (error) throw error;
				res.cookie('token', token);
				if (!user.on_boarding) {
					return res.json({
						user,
						redirectTo: '/onboarding',
					});
				} else {
					await user.populate('workspaces');
					const workspace = user.workspaces[0];
					if (!workspace) {
						return res.json({
							redirectTo: '/onboarding',
							user,
						});
					}
					return res.json({
						redirectTo: workspace.url,
						user,
					});
				}
			}
		);
	} catch (error) {
		
		return res.status(500).json({ error: 'Server Error' });
	}
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
	const cookies = cookie.parse(req.headers.cookie || '');
	const token = cookies.token;
	try {
		if (token) {
			jwt.verify(token, process.env.JWT_SECRECT, {}, (error, user) => {
				if (error) {
					res.status(403).json({ error: 'Access Denied' });
				} else {
					res.json(user);
				}
			});
		} else {
			res.status(403).json({ error: 'Access Denied' });
		}
	} catch (error) {
		
		res.status(500).json({ error: 'Server Error' });
	}
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
	const { id, username, name } = req.query;
	try {
		const data = await User.findOneAndUpdate(
			{ _id: id },
			{ $set: { username: username, name: name } },
			{ new: true }
		);
		res.status(200).json({ success: true, message: 'User been updated', data });
	} catch (err) {
		
		res.status(500).json({ error: 'Server Error' });
	}
};

const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const id = req.query.id;
	try {
		if (!id || id == '') {
			return next(new AppError('No user found', 500));
		}
		const data = await User.findOne({ _id: id }).populate('workspaces');
		if (data) {
			res.json(data);
		} else {
			res.status(404).send();
		}
	} catch (err) {
		
		res.status(500).json({ error: 'Server Error' });
	}
};

const getAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const id = req.query.workspaceId;
	const workspace = await Workspace.find({ _id: id }).populate({
		path: 'users',
	});
	res.json(workspace[0].users);
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
	try {
		res.clearCookie('token');
		res.status(200).json({ success: 'Logout Successful' });
	} catch (error) {
		
		res.status(500).json({ error: 'Server Error' });
	}
};

// Endpoint: /password/reset
const forgotPassword = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { email } = req.body;

	if (!email) {
		return res.status(422).json({
			error: 'Email is required',
		});
	}

	const user = await User.findOne({ email });

	if (!user) {
		// Return successful msg even if user doesn't exist, for security reasons
		return res.status(200).json({
			message:
				'If your email address is in our database, you will receive a password reset email shortly.',
		});
	}

	jwt.sign(
		{
			user: user._id,
		},
		process.env.JWT_SECRECT,
		{ expiresIn: '15m' },
		(err, emailToken) => {
			sendMail(email, user.username, emailToken, 'password');
		}
	);

	return res.status(200).json({
		message:
			'If your email address is in our database, you will receive a password reset email shortly.',
	});
};

// Endpoint: /password/:token
const resetPassword = async (
	req: Request,
	res: Response
): Promise<Response | void> => {
	const { token } = req.params;
	const { newPassword } = req.body;

	if (!token || !newPassword) {
		return res
			.status(422)
			.json({ error: 'Token and new password are required.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRECT) as JwtPayload;
		const user = await User.findById(decoded.user);
		if (!user) {
			return res.status(400).json({ error: 'Invalid or expired token.' });
		}

		const hashedPassword = await hashPassword(newPassword);
		user.password = hashedPassword;
		await user.save();

		res
			.status(200)
			.json({ message: 'Your password has been reset successfully.' });
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getGithubAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;
  try {
    const accessTokenResponse = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );
    const response = await accessTokenResponse.json();
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
}; // -- disabled for merge into main
export {
	registerUser,
	loginUser,
	getProfile,
	logoutUser,
	getUser,
	updateProfile,
	verifyEmail,
	signInUsingNextAuth,
	getAllUsers,
	forgotPassword,
	resetPassword,
	getGithubAccessToken, // -- disabled for merge into main
};
