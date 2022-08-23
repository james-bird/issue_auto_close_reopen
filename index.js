const core = require('@actions/core');
const github = require('@actions/github');
import got from 'got';

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
const orgName = core.getInput('owner')
const proNumber = core.getInput('projectNumber')
const ownership_type = core.getInput('ownership-type')

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
  let rply = got.post(endpoint, options).json()
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
  let rply = got.post(endpoint, options).json();
};



function createQueryOptions(offset = "") {
  if (ownership_type == "organisation") {
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
  } elseif(ownership_type == "user"){
    let query = `
    query{user(login: \"${orgName}\") {
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
  }

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
  let data = await got.post(endpoint, options).json();
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

