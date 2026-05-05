import pinoHttp from "pino-http";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

export const httpLogger = pinoHttp({
  logger,
  genReqId: function (req, _res) {
    const existingID = req.id ?? req.headers["x-request-id"];
    if (existingID) return existingID;
    const id = uuidv4();
    _res.setHeader("X-Request-Id", id);
    return id;
  },
  customProps: (req, _res) => {
    return {
      correlationId: req.id,
    };
  },
});
