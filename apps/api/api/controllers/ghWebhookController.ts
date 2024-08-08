// import { Request, Response } from "express";
// import { postWebhook } from "../webhooks/octokit";
// import Commits from "../models/commits";

// // disabled for merge into main

// export const receiveghWebhook = async (req: Request, res: Response) => {
//
//     // Receiving webhook
//     try {
//         if (req.body.head_commit !== undefined) {
//             const newCommit = await Commits.create({
//                 id: req.body.head_commit.id,
//                 tree_id: req.body.head_commit.tree_id,
//                 distinct: req.body.head_commit.distinct,
//                 message: req.body.head_commit.message,
//                 timestamp: req.body.head_commit.timestamp,
//                 url: req.body.head_commit.url,
//                 author: req.body.head_commit.author,
//                 committer: req.body.head_commit.committer,
//                 added: req.body.head_commit.added,
//                 removed: req.body.head_commit.removed,
//                 modified: req.body.head_commit.modified,
//                 repoName: req.body.repository.name,
//                 owner: req.body.repository.owner.login
//             })
//             res.json(newCommit);
//         }
//     } catch (error) {
//
//     }
// }

// export const createGhWebhook = async (req: Request, res: Response) => {
//     const { ghUser, ghRepo, ghToken, workspaceId } = req.query
//     const hookdeckToken = process.env.HOOKDECK_AUTH_TOKEN
//     // const expressURL = process.env.NEXT_PUBLIC_SERVER;
//     const expressURL = 'https://three-mangos-cheat.loca.lt'
//     if (hookdeckToken) {
//         postWebhook(String(ghToken), String(ghUser), String(ghRepo), `${workspaceId}-${ghRepo}`, `${workspaceId}-${ghRepo}`, `${expressURL}/webhooks/ghWebhook`, hookdeckToken)
//     }

// }
// //
