// import { Request, Response } from "express";
// import { CommitModel as Commit } from "../models/commits";

// export const getCommitsByRepo = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { repoName } = req.query;
//   try {
//     const filteredCommits = await Commit.find({ repoName: repoName });
//     if (filteredCommits.length > 0) {
//       res.json(filteredCommits);
//     } else {
//       res.status(404).json({ error: "Commits not found" });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }; //-- disabled for merge into main
