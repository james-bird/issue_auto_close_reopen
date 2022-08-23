/******/ var __webpack_modules__ = ({

/***/ 454:
/***/ ((module) => {

module.exports = eval("require")("got");


/***/ }),

/***/ 224:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__) => {
/* harmony import */ var got__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(454);
const core = require('@actions/core');
const github = require('@actions/github');


const accessToken = core.getInput('accessToken');
const endpoint = "https://api.github.com/graphql";

//function to split string into array of strings by delimiter , and remove white space
function splitString(str, delimiter = ",") {
  return str.split(delimiter).map(function (item) {
    return item.trim();
  }
  );
}

const close_list = splitString(core.getInput('closedColumns'));
const open_list = splitString(core.getInput('openColumns'));
const orgName = core.getInput('organisation')
const proNumber = core.getInput('projectNumber')

// A function to close a github issue
function closeIssue(issueID, title) {
  console.log("Closing issue " + title);
  let query = `mutation {
closeIssue(input: {issueId: \"${issueID}\"}) {
    issue {
      closed
    }
  }
    }`;

  let options = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };
  let rply = got__WEBPACK_IMPORTED_MODULE_0__.post(endpoint, options).json();
};


// A function to reopen a github issue
function reopenIssue(issueID, title) {
  console.log("Reopening issue " + title);
  let query = `mutation {
reopenIssue(input: {issueId: \"${issueID}\"}) {
    issue {
      closed
    }
  }
    }`;

  let options = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };
  let rply = got__WEBPACK_IMPORTED_MODULE_0__.post(endpoint, options).json();
};



function createQueryOptions(offset = "") {

  let query = `
query{organization(login: \"${orgName}\") {
    projectV2(number: ${proNumber}) {
      items(first:50  after: \"${offset}\") {
        totalCount
        nodes {
          project {
            title
          }
          content {
            ... on Issue {
              id
              title
              state
            }
          }
          fieldValues(first: 10) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                nameHTML
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`;

  let options = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  return options;
}

let runner = true;

let curs = "";

while (runner) {
  let options = createQueryOptions(curs)
  let data = await got__WEBPACK_IMPORTED_MODULE_0__.post(endpoint, options).json();
  // console.log(data);
  let nextPage =
    data["data"]["organization"]["projectV2"]["items"]["pageInfo"]["hasNextPage"]
  curs =
    data["data"]["organization"]["projectV2"]["items"]["pageInfo"]["endCursor"];
  console.log(nextPage);
  runner = nextPage;
  let items =
    data["data"]["organization"]["projectV2"]["items"]["nodes"]
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let id = item["content"]["id"];
    let title = item["content"]["title"];
    let state = item["content"]["state"];
    let fields = item["fieldValues"]["nodes"];
    let fieldNames = [];
    for (let j = 0; j < fields.length; j++) {
      let field = fields[j];
      // if not undefined 
      if (field["nameHTML"] !== undefined) {
        fieldNames.push(field["nameHTML"]);
      }
    }
    let columnName = fieldNames[0];
    console.log(title, state, id, columnName);
    if (close_list.includes(columnName) && state === "OPEN") {
      closeIssue(id, title);
    }
    if (open_list.includes(columnName) && state === "CLOSED") {
      reopenIssue(id, title);
    }
  }
}


__webpack_handle_async_dependencies__();
}, 1);

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var completeQueue = (queue) => {
/******/ 		if(queue) {
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var completeFunction = (fn) => (!--fn.r && fn());
/******/ 	var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackThen]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					completeQueue(queue);
/******/ 					queue = 0;
/******/ 				});
/******/ 				var obj = {};
/******/ 											obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep['catch'](reject));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 							ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 							ret[webpackExports] = dep;
/******/ 							return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue = hasAwait && [];
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var isEvaluating = true;
/******/ 		var nested = false;
/******/ 		var whenAll = (deps, onResolve, onReject) => {
/******/ 			if (nested) return;
/******/ 			nested = true;
/******/ 			onResolve.r += deps.length;
/******/ 			deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 			nested = false;
/******/ 		};
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackThen] = (fn, rejectFn) => {
/******/ 			if (isEvaluating) { return completeFunction(fn); }
/******/ 			if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 			queueFunction(queue, fn);
/******/ 			promise['catch'](rejectFn);
/******/ 		};
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			if(!deps) return outerResolve();
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn, result;
/******/ 			var promise = new Promise((resolve, reject) => {
/******/ 				fn = () => (resolve(result = currentDeps.map((d) => (d[webpackExports]))));
/******/ 				fn.r = 0;
/******/ 				whenAll(currentDeps, fn, reject);
/******/ 			});
/******/ 			return fn.r ? promise : result;
/******/ 		}).then(outerResolve, reject);
/******/ 		isEvaluating = false;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(224);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
