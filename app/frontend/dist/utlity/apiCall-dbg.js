"use strict";

sap.ui.define(["sap/m/MessageToast", "sap/m/MessageBox"], function (MessageToast, MessageBox) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
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
  const GET = function (model, entitySet, filters, select, expand, skip, top) {
    try {
      // Mohammad Sohail: filter array must be passed as a parameter to the function
      const queryOptions = {};
      if (expand) queryOptions.$expand = expand;
      if (select) queryOptions.$select = select;
      const listBinding = model.bindList(entitySet, undefined, undefined, filters ? filters : undefined, queryOptions);
      return Promise.resolve(_catch(function () {
        return Promise.resolve(listBinding.requestContexts(skip ?? 0, top ?? 100000000)).then(function (contexts) {
          const data = contexts.map(context => context.getObject());
          return data;
        });
      }, function (error) {
        MessageBox.error(error.cause.message);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  // add $apply filter and $filter
  const _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }
          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }
      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }
      pact.s = state;
      pact.v = value;
      const observer = pact.o;
      if (observer) {
        observer(pact);
      }
    }
  }
  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}
    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;
      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;
        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }
          return result;
        } else {
          return this;
        }
      }
      this.o = function (_this) {
        try {
          const value = _this.v;
          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };
      return result;
    };
    return _Pact;
  }();
  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }
  function _forTo(array, body, check) {
    var i = -1,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    return pact;
  }
  const GET_GROUP = function (model, entitySet, apply, filter) {
    try {
      // Mohammad Sohail: filter array must be passed as a parameter to the function
      const queryOpt = {};
      if (apply) queryOpt.$apply = apply;
      if (filter) queryOpt.$filter = filter;
      const listBinding = model.bindList(entitySet, undefined, undefined, undefined, queryOpt);
      return Promise.resolve(_catch(function () {
        return Promise.resolve(listBinding.requestContexts()).then(function (contexts) {
          const data = contexts.map(context => context.getObject());
          return data;
        });
      }, function (error) {
        MessageBox.error(error.cause.message);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }; // CREATE Operation: Add a New Entry
  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;
      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);
            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }
          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }
      _cycle();
      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}
          return value;
        };
        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }
        _fixup();
      }
      return pact;
    }
    // No support for Symbol.iterator
    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    }
    // Handle live collections properly
    var values = [];
    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }
    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }
  const POST = function (model, entitySet, newData) {
    try {
      const listBinding = model.bindList(entitySet);
      const _temp = _catch(function () {
        return Promise.resolve(listBinding.create(newData)).then(function () {
          MessageToast.show("Record created successfully!");
        });
      }, function (error) {
        MessageBox.error(error?.message);
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  // UPDATE Operation: Update an Entry by ID
  const PUT = function (model, entitySet, aFilter, updatedData) {
    try {
      try {
        let oBindList = model.bindList(entitySet);
        oBindList.filter(aFilter).requestContexts().then(aContexts => {
          const oContext = aContexts[0]; // The context of the entity to update
          Object.entries(updatedData).forEach(_ref => {
            let [key, value] = _ref;
            oContext.setProperty(key, value);
          });
          MessageToast.show("Record Updated successfully!");
        });
      } catch (error) {
        MessageBox.error(error?.message);
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  // DELETE Operation: Delete an Entry by ID
  const DELETE = function (model, entitySet, aFilter) {
    try {
      const _temp3 = _catch(function () {
        // Bind the list with the specified entity set and filters
        const oBindList = model.bindList(entitySet, undefined, undefined, aFilter);

        // Request the context for the filtered entry
        return Promise.resolve(oBindList.requestContexts()).then(function (aContexts) {
          const _temp2 = function () {
            if (aContexts.length > 0) {
              const oContext = aContexts[0];

              // Perform the delete operation
              return Promise.resolve(oContext.delete()).then(function () {
                MessageToast.show("Record Deleted Successfully!");
              });
            } else {
              MessageToast.show("No matching record found.");
            }
          }();
          if (_temp2 && _temp2.then) return _temp2.then(function () {});
        });
      }, function (error) {
        MessageBox.error(`Error deleting entry: ${error.message}`);
      });
      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  // BULK UPLOAD Functionality
  const BULK_UPLOAD = function (model, entitySet, data, view) {
    try {
      let _exit = false;
      const listBinding = model.bindList(entitySet);
      const totalRecords = data.length;
      let currentRecord = 0;
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      return Promise.resolve(_catch(function () {
        function _temp5(_result4) {
          return _exit ? _result4 : Promise.resolve(model.submitBatch("Bulk_Upload")).then(function () {
            MessageToast.show("All entries created successfully!");
            return true;
          });
        }
        const _temp4 = _forOf(data.entries(), function (_ref2) {
          let [index, entry] = _ref2;
          return _catch(function () {
            // console.log(`Creating Record ${index + 1}`);
            // Create the entry and wait for it to complete
            return Promise.resolve(listBinding.create(entry).created()).then(function () {
              currentRecord++;
              updateProgress(currentRecord, totalRecords, view); // Update progress
              // Introduce a 10-msecobd delay before creating the next record
              return Promise.resolve(delay(5)).then(function () {});
            });
          }, function (error) {
            throw error; // Stop if any record fails
          });
        }, function () {
          return _exit;
        });
        return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4); // Submit the batch after processing all entries
      }, function (error) {
        view.dialog?.close();
        MessageBox.error(`Error during bulk upload: ${error.message}`);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  // Helper function to update progress
  const updateProgress = (currentRecord, totalRecords, then) => {
    const percent = Math.floor(currentRecord / totalRecords * 100);
    const displayValue = `${currentRecord}/${totalRecords}`;
    const model = then.getView().getModel("loader");
    model.setProperty("/percent", percent);
    model.setProperty("/displayValue", displayValue);
    if (currentRecord % Math.floor(totalRecords / 5) === 0) {
      const {
        title,
        description,
        illustrationType
      } = getMotivationalMessage(currentRecord, totalRecords);
      model.setProperty("/title", title);
      model.setProperty("/description", description);
      model.setProperty("/illustrationType", illustrationType);
    }
  };

  // Helper function to provide motivational messages
  const getMotivationalMessage = (currentRecord, totalRecords) => {
    switch (true) {
      case currentRecord <= totalRecords / 5:
        return {
          title: "Off to a Great Start!",
          description: "The journey has just begun—every step matters!",
          illustrationType: "sapIllus-NoMail"
        };
      case currentRecord <= totalRecords / 5 * 2:
        return {
          title: "Keep the Momentum!",
          description: "You're making solid progress—don't stop now!",
          illustrationType: "sapIllus-NoTasks"
        };
      case currentRecord <= totalRecords / 5 * 3:
        return {
          title: "Halfway There!",
          description: "You've reached the midpoint—keep up the great work!",
          illustrationType: "sapIllus-SimpleBalloon"
        };
      case currentRecord <= totalRecords / 5 * 4:
        return {
          title: "Almost There!",
          description: "Just a little more—you're almost at the finish line!",
          illustrationType: "sapIllus-Tent"
        };
      default:
        return {
          title: "Upload Complete!",
          description: "All records have been successfully uploaded!",
          illustrationType: "sapIllus-BalloonSky"
        };
    }
  };

  // fetch POST CALL
  const FETCH_POST = function (url, newData) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newData)
        })).then(function (response) {
          return Promise.resolve(response.json()).then(function (res) {
            if (!response.ok) {
              MessageBox.error(`Status ${res.error.code} - ${res.error.message}`);
              return null;
            }
            return res;
          });
        });
      }, function (error) {
        MessageBox.error(error.message);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  // Date formatter
  const formatToISOString = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const EMAIL_NOTIFY = emailDetails => {
    // let emailObject = {
    //     request_requestId: requestId,
    //     emailRequest: JSON.stringify(emailDetails)
    // }

    FETCH_POST("/odata/v4/catalog/EmailLogs", emailDetails);
  };
  var __exports = {
    __esModule: true
  };
  __exports.GET = GET;
  __exports.GET_GROUP = GET_GROUP;
  __exports.POST = POST;
  __exports.PUT = PUT;
  __exports.DELETE = DELETE;
  __exports.BULK_UPLOAD = BULK_UPLOAD;
  __exports.FETCH_POST = FETCH_POST;
  __exports.formatToISOString = formatToISOString;
  __exports.EMAIL_NOTIFY = EMAIL_NOTIFY;
  return __exports;
});
//# sourceMappingURL=apiCall-dbg.js.map
