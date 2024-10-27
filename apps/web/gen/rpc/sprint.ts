
import { Context } from "@squared/context";

export interface sprintClient {
  getSprints(ctx: Context, ): Promise<any>;
  startNextSprint(ctx: Context, ): Promise<any>;
  getSprintTasks(ctx: Context, ): Promise<any>;
  endSprint(ctx: Context, ): Promise<any>;
  addRetrospectiveItem(ctx: Context, ): Promise<any>;
  updateRetrospectiveItem(ctx: Context, ): Promise<any>;
  getRetrospectiveItems(ctx: Context, ): Promise<any>;
}

export const createsprintClient = (baseUrl: string): sprintClient => {
  return {
    getSprints: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    startNextSprint: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    getSprintTasks: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    endSprint: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    addRetrospectiveItem: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    updateRetrospectiveItem: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
    getRetrospectiveItems: async (ctx: Context, ) => {
      // Implementation goes here
      throw new Error("Not implemented");
    },
  };
};
