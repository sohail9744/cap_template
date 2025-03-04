const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const {
    Employees,
    Sites,
    Positions,
    BusinessUnits,
    Timesheet,
    WorkflowApprovalConfig,
    Requests,
    RequestHistories,
    EmailLogs,
  } = this.entities;

  this.on("sfUser1", async (req) => {
    const { userId } = req.data;
    if (!userId) req.reject(400, "Missing parameter: userId");

    const CAP = await cds.connect.to("SF_V");
    try {
      const result = await CAP.send(
        "GET",
        `User?$filter=userId eq '${String(userId)}'`,
        { "Content-Type": "application/json" }
      );
      return result;
    } catch (error) {
      req.error(500, error.message);
    }
  });

  this.on("READ", "sfUser1", async (req) => {
    try {
      // Extract the `userId` from the query parameters
      const userId = req.query.userId;
      if (!userId) {
        return { error: "Missing query parameter: userId" };
      }

      // Connect to the SAP Process Automation API through the configured destination
      const CAP = await cds.connect.to("SF_V");
      console.log("Fetching data for userId:", userId);

      const result = await CAP.send(
        "GET",
        `User?$filter=userId eq '${String(userId)}'`,
        {
          "Content-Type": "application/json",
        }
      );

      console.log("Destination is resolved:", result);
      return result;
    } catch (error) {
      console.error("Error during GET call:", error);
      return { error: error.message };
    }
  });
  
});
