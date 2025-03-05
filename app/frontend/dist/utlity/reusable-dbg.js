"use strict";

sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
  "use strict";

  /**
   * Converts a given input (either a Date object or string in "DD-MM-YYYY" format) to ISO 8601 format.
   *
   * @param {string | Date} input - Either a Date object or a string in "DD-MM-YYYY" format.
   * @returns {string} - The date in ISO 8601 format.
   */
  const ConvertToISOFormat = input => {
    let date;

    // Check if input is a string or Date object
    if (typeof input === "string") {
      const [day, month, year] = input.split("-").map(Number);
      date = new Date(year, month - 1, day); // Create Date object from string
    } else if (input instanceof Date) {
      date = input; // Use the passed Date object directly
    } else {
      throw new Error("Invalid input: Please provide a Date object or a valid date string.");
    }

    // Format the date to ISO 8601 using SAPUI5's DateFormat utility
    const dateFormat = DateFormat.getDateTimeInstance({
      pattern: "yyyy-MM-dd'T'HH:mm:ss'Z'",
      UTC: true
    });
    return dateFormat.format(date);
  };

  // // Example Usage
  // console.log(convertToISOFormat("24-09-2024")); // Output: "2024-09-24T00:00:00Z"
  // console.log(convertToISOFormat(new Date())); // Output: Current date in ISO format, e.g., "2024-10-06T14:35:45Z"
  var __exports = {
    __esModule: true
  };
  __exports.ConvertToISOFormat = ConvertToISOFormat;
  return __exports;
});
//# sourceMappingURL=reusable-dbg.js.map
