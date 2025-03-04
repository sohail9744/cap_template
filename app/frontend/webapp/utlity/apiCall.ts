import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Context from "sap/ui/model/odata/v4/Context";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import MessageBox from "sap/m/MessageBox";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
/* 
ODATA V4 API Calls Blog Step -By- Step Guide
https://community.sap.com/t5/technology-blogs-by-sap/implementing-crud-operations-in-odata-v4/ba-p/13572508
@READ Operation: Fetch Data using List Binding with parameters
@Mohammad Sohail(sohail9744): Example for GetCALL
const filters = [
  new Filter("status", FilterOperator.EQ, "active"),
  new Filter("category", FilterOperator.EQ, "technology")
];

const data = await GetCall(model, "MyEntitySet", 0, 10, filters);
*/
export const GET = async (
  model: ODataModel,
  entitySet: string,
  filters?: Filter[],
  select?: string,
  expand?: string,
  skip?: number,
  top?: number
) => {
  // Mohammad Sohail: filter array must be passed as a parameter to the function
  const queryOptions: Record<string, any> = {};

  if (expand) queryOptions.$expand = expand;
  if (select) queryOptions.$select = select;

  const listBinding = model.bindList(
    entitySet,
    undefined,
    undefined,
    filters ? filters : undefined,
    queryOptions
  );

  try {
    const contexts: Context[] = await listBinding.requestContexts(
      skip ?? 0,
      top ?? 100000000
    );
    const data = contexts.map((context) => context.getObject());
    return data;
  } catch (error: any) {
    MessageBox.error(error.cause.message)
  }
};
// add $apply filter and $filter
export const GET_GROUP = async (
  model: ODataModel,
  entitySet: string,
  apply: string,
  filter: string
) => {
  // Mohammad Sohail: filter array must be passed as a parameter to the function
  const queryOpt: Record<string, any> = {};
  if (apply) queryOpt.$apply = apply;
  if (filter) queryOpt.$filter = filter;
  const listBinding = model.bindList(
    entitySet,
    undefined,
    undefined,
    undefined,
    queryOpt
  );

  try {
    const contexts: Context[] = await listBinding.requestContexts();
    const data = contexts.map((context) => context.getObject());
    return data;
  } catch (error: any) {
    MessageBox.error(error.cause.message)
  }
};


// CREATE Operation: Add a New Entry
export const POST = async (
  model: ODataModel,
  entitySet: string,
  newData: any
): Promise<void> => {
  const listBinding = model.bindList(entitySet);
  try {
    await listBinding.create(newData);
    MessageToast.show("Record created successfully!");
  } catch (error: any) {
    MessageBox.error(error?.message)
  }
};
// UPDATE Operation: Update an Entry by ID
export const PUT = async (
  model: ODataModel,
  entitySet: string,
  aFilter: Filter[],
  updatedData: any
): Promise<void> => {
  try {
    let oBindList = model.bindList(entitySet);
    oBindList
      .filter(aFilter)
      .requestContexts()
      .then((aContexts) => {
        const oContext = aContexts[0]; // The context of the entity to update
        Object.entries(updatedData).forEach(([key, value]) => {
          oContext.setProperty(key, value);
        });
        MessageToast.show("Record Updated successfully!");
      });
  } catch (error: any) {
    MessageBox.error(error?.message)
    console.error(`Error updating entry in ${entitySet}:`, error);
  }
};

// DELETE Operation: Delete an Entry by ID
export const DELETE = async (
  model: ODataModel,
  entitySet: string,
  aFilter: Filter[]
): Promise<void> => {
  try {
    // Bind the list with the specified entity set and filters
    const oBindList = model.bindList(entitySet, undefined, undefined, aFilter);

    // Request the context for the filtered entry
    const aContexts = await oBindList.requestContexts();

    if (aContexts.length > 0) {
      const oContext = aContexts[0];

      // Perform the delete operation
      await oContext.delete();
      MessageToast.show("Record Deleted Successfully!");
    } else {
      MessageToast.show("No matching record found.");
    }
  } catch (error: any) {
    MessageBox.error(`Error deleting entry: ${error.message}`);
    console.error(`Error deleting entry from ${entitySet}:`, error);
  }
};

// BULK UPLOAD Functionality
export const BULK_UPLOAD = async (
  model: ODataModel,
  entitySet: string,
  data: any[],
  view: any
) => {
  const listBinding = model.bindList(entitySet);
  const totalRecords = data.length;
  let currentRecord = 0;
  const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
  try {
    for (const [index, entry] of data.entries()) {
      try {
        // console.log(`Creating Record ${index + 1}`);

        // Create the entry and wait for it to complete
        await listBinding.create(entry).created();
        currentRecord++;
        updateProgress(currentRecord, totalRecords, view); // Update progress
        // Introduce a 10-msecobd delay before creating the next record
        await delay(5);
      } catch (error) {
        console.error(`Failed to create record ${index + 1}:`, error);
        throw error; // Stop if any record fails
      }
    }

    // Submit the batch after processing all entries
    await model.submitBatch("Bulk_Upload");
    MessageToast.show("All entries created successfully!");
    return true
  } catch (error: any) {
    view.dialog?.close();
    MessageBox.error(`Error during bulk upload: ${error.message}`);
  }
};


// Helper function to update progress
const updateProgress = (currentRecord: number, totalRecords: number, then: any) => {
  const percent = Math.floor((currentRecord / totalRecords) * 100);
  const displayValue = `${currentRecord}/${totalRecords}`;

  const model = then.getView().getModel("loader") as JSONModel;
  model.setProperty("/percent", percent);
  model.setProperty("/displayValue", displayValue);

  if (currentRecord % Math.floor(totalRecords / 5) === 0) {
    const { title, description, illustrationType } =
      getMotivationalMessage(currentRecord, totalRecords);
    model.setProperty("/title", title);
    model.setProperty("/description", description);
    model.setProperty("/illustrationType", illustrationType);
  }
};

// Helper function to provide motivational messages
const getMotivationalMessage = (currentRecord: number, totalRecords: number) => {
  switch (true) {
    case currentRecord <= totalRecords / 5:
      return {
        title: "Off to a Great Start!",
        description: "The journey has just begun—every step matters!",
        illustrationType: "sapIllus-NoMail",
      };
    case currentRecord <= (totalRecords / 5) * 2:
      return {
        title: "Keep the Momentum!",
        description: "You're making solid progress—don't stop now!",
        illustrationType: "sapIllus-NoTasks",
      };
    case currentRecord <= (totalRecords / 5) * 3:
      return {
        title: "Halfway There!",
        description: "You've reached the midpoint—keep up the great work!",
        illustrationType: "sapIllus-SimpleBalloon",
      };
    case currentRecord <= (totalRecords / 5) * 4:
      return {
        title: "Almost There!",
        description: "Just a little more—you're almost at the finish line!",
        illustrationType: "sapIllus-Tent",
      };
    default:
      return {
        title: "Upload Complete!",
        description: "All records have been successfully uploaded!",
        illustrationType: "sapIllus-BalloonSky",
      };
  }
};

// fetch POST CALL
export const FETCH_POST = async (
  url: string,
  newData: any
): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    let res = await response.json()
    if (!response.ok) {
      MessageBox.error(`Status ${res.error.code} - ${res.error.message}`);
      return null
    }
    return res
  } catch (error: any) {
    MessageBox.error(error.message);
  }
};


// Date formatter
export const formatToISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const EMAIL_NOTIFY = (emailDetails: {}) => {

  // let emailObject = {
  //     request_requestId: requestId,
  //     emailRequest: JSON.stringify(emailDetails)
  // }
  console.log(emailDetails)
  FETCH_POST("/odata/v4/catalog/EmailLogs", emailDetails)
}