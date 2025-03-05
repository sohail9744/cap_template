"use strict";

sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
  "use strict";

  let formatter;
  (function (_formatter) {
    function statusText(sValue) {
      let status = sValue;
      switch (status) {
        case "Pending":
          return 'Information';
        case "Rejected":
          return 'Error';
        case "Approved":
          return 'Success';
        default:
          return 'None';
      }
    }
    _formatter.statusText = statusText;
    function formatDate(date) {
      if (!date) return "";
      const oDateFormat = DateFormat.getDateInstance({
        pattern: "dd-MM-yyyy"
      });
      return oDateFormat.format(date);
    }
    _formatter.formatDate = formatDate;
    function priotity(sValue) {
      let status = sValue?.toLocaleLowerCase();
      switch (status) {
        case "low":
          return 'Information';
        case "high":
          return 'Error';
        case "medium":
          return 'Warning';
        default:
          return 'None';
      }
    }
    _formatter.priotity = priotity;
    function dateFormat(sDate) {
      if (!sDate) {
        return '';
      }
      try {
        const oDateFormat = DateFormat.getDateInstance({
          pattern: "dd MMM yyyy"
        });

        // Parse the input date string
        let oDate;

        // Check if it's an ISO string (like "2024-11-07T08:09:18.858Z")
        if (sDate.includes('T') && sDate.includes('Z')) {
          oDate = new Date(sDate); // JavaScript handles ISO strings well
        } else {
          // Handle other date formats
          oDate = new Date(sDate);
        }

        // Check if the date is valid
        if (isNaN(oDate.getTime())) {
          return '';
        }
        return oDateFormat.format(oDate);
      } catch (error) {
        return '';
      }
    }
    _formatter.dateFormat = dateFormat;
    function statusFormat(sValue) {
      let status = sValue?.split(' ')[0]?.toLocaleLowerCase();
      switch (status) {
        case "pending":
          return 'Information';
        case "reassigned":
          return 'Information';
        case "rejected":
          return 'Error';
        case "approved":
          return 'Success';
        case "reject":
          return 'Error';
        case "closed":
          return 'Success';
        case "submitted":
          return 'Information';
        case "vendor":
          return 'Warning';
        default:
          return 'None';
      }
    }
    _formatter.statusFormat = statusFormat;
    function iconFormat(sValue) {
      let status = sValue?.split(' ')[0]?.toLocaleLowerCase();
      switch (status) {
        case "pending":
          return 'sap-icon://pending';
        case "rejected":
          return 'sap-icon://sys-cancel-2';
        case "approved":
          return 'sap-icon://sys-enter-2';
        case "reject":
          return 'sap-icon://sys-cancel-2';
        case "closed":
          return 'sap-icon://sys-enter-2';
        case "submitted":
          return 'sap-icon://activity-2';
        default:
          return 'sap-icon://pending';
      }
    }
    _formatter.iconFormat = iconFormat;
  })(formatter || (formatter = {}));
  var __exports = {
    __esModule: true
  };
  __exports.formatter = formatter;
  return __exports;
});
//# sourceMappingURL=formatter-dbg.js.map
