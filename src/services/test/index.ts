import { executionError } from "src/services/responseHandling";

const testCoding = async (request: any) => {
  try {
    const { nama } = request;
    if (!nama) {
      throw new Error("nama tidak boleh kosng");
    }
    return nama;
  } catch (error) {
    return executionError(404, `Error ${error}`);
  }
};

export default { testCoding };
