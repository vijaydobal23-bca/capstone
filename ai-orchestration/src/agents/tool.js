
import axios from "axios";
import { tool } from "@langchain/core/tools";
import fs from "fs";

export const Listfiles = tool(
  async ({ paths }) => {
     for (const path of paths) {
      try {
        const response = await axios.get("");
        return(response.data.files);

       
        } catch (error) {
        result.push({
          path,
          error: error.message,
        });
      }
    }

    return result;
  },
  {
    name: "list_files",
    description: "Read the contents of files from the provided paths.",
    schema: undefined,
  }
);
