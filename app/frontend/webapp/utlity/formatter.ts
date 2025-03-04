import DateFormat from "sap/ui/core/format/DateFormat";

export namespace formatter {
    export function statusText(sValue: string): string {

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
    export function formatDate(date: string): string {
        if (!date) return "";
        const oDateFormat = DateFormat.getDateInstance({ pattern: "dd-MM-yyyy" }) as any
        return oDateFormat.format(date)
    }
    export function priotity(sValue: string): string {
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
    export function dateFormat(sDate: string): string {
        if (!sDate) {
            return '';
        }

        try {
            const oDateFormat = DateFormat.getDateInstance({
                pattern: "dd MMM yyyy"
            });

            // Parse the input date string
            let oDate: Date;

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
            console.error('Error formatting date:', error);
            return '';
        }
    }

    export function statusFormat(sValue: string): string {

        let status = sValue?.split(' ')[0]?.toLocaleLowerCase()
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
    export function iconFormat(sValue: string): string {

        let status = sValue?.split(' ')[0]?.toLocaleLowerCase()
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
}