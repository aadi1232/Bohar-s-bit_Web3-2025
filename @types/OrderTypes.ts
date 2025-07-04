import { propmt } from "./promptTypes";

export type Orders = {
  id: string;
  userId: string;
  promptId: string;
  prompt: propmt;

  createdAt: Date;
  updatedAt: Date;
};
