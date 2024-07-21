interface JWTPayload {
  user: string;
  workspaceId?: string;
  id?: string;
}

export default JWTPayload;
