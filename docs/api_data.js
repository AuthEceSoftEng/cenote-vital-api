define({ "api": [
  {
    "type": "post",
    "url": "/projects/:PROJECT_ID/events/:EVENT_COLLECTION",
    "title": "Record events",
    "version": "0.1.0",
    "name": "RecordEvents",
    "group": "Events",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "EVENT_COLLECTION",
            "description": "<p>The event collection name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "writeKey/masterKey",
            "description": "<p>Key for authorized write.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/Object[]",
            "optional": false,
            "field": "payload",
            "description": "<p>Event data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "payload Example:",
          "content": "\"payload\": [{\n  \"data\": {\n      \"current\": 7.5,\n      \"voltage\": 10000,\n      \"note\": \"That's weird.\"\n  },\n  \"timestamp\": 1549622362\n}]",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Accepted 202": [
          {
            "group": "Accepted 202",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 202 ACCEPTED\n{\n  \"message\": \"Event Sent.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/events.js",
    "groupTitle": "Events",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoDataSentError",
            "description": "<p>No data sent.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "NoDataSentError:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoDataSentError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/projects/:PROJECT_ID/keys/",
    "title": "Create a new key",
    "version": "0.1.0",
    "name": "CreateKey",
    "group": "Keys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readKey/writeKey/masterKey",
            "description": "<p>The new key</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "body Example:",
          "content": "{\n  \"readKey\": \"249c8ba8-68c8\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Key successfully regenerated!\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/keys.js",
    "groupTitle": "Keys",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoDataSentError",
            "description": "<p>No data sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AlreadyExistsError",
            "description": "<p>This payload already exists in this project.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoDataSentError:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoDataSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "AlreadyExistsError:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": \"AlreadyExistsError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/projects/:PROJECT_ID/keys/:KEY",
    "title": "Delete a specific key",
    "version": "0.1.0",
    "name": "DeleteKey",
    "group": "Keys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "KEY",
            "description": "<p>An API key.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Key successfully deleted!\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/keys.js",
    "groupTitle": "Keys",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoDataSentError",
            "description": "<p>No data sent.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoDataSentError:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoDataSentError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/keys",
    "title": "Get every object key",
    "version": "0.1.0",
    "name": "GetAllKeys",
    "group": "Keys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "readKeys",
            "description": "<p>All read keys.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "writeKeys",
            "description": "<p>All write keys.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "masterKeys",
            "description": "<p>All master keys.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"readKeys\": [\"249c8ba8-68c8\", \"249c8ba8-1234\",...]\n  \"writeKeys\": [\"249c8ba8-68c8\", \"249c8ba8-1234\",...]\n  \"masterKeys\": [\"249c8ba8-68c8\", \"249c8ba8-1234\",...]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/keys.js",
    "groupTitle": "Keys",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/keys/:KEY",
    "title": "Get info about a specific key",
    "version": "0.1.0",
    "name": "GetKeyInfo",
    "group": "Keys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "KEY",
            "description": "<p>An API key.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Key's type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "active",
            "description": "<p>If key is active or revoked.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"type\": \"read\"\n  \"active\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/keys.js",
    "groupTitle": "Keys",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/projects/:PROJECT_ID/keys/regenerate",
    "title": "Regenerate a key",
    "version": "0.1.0",
    "name": "RegenerateKey",
    "group": "Keys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readKey/writeKey/masterKey",
            "description": "<p>The key to regenerate</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "body Example:",
          "content": "{\n  \"readKey\": \"249c8ba8-68c8\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "readKey/writeKey/masterKey",
            "description": "<p>The new key.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Key successfully regenerated!\"\n  \"readKey\": \"249c8ba8-6szdf\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/keys.js",
    "groupTitle": "Keys",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoDataSentError",
            "description": "<p>No data sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoDataSentError:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoDataSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/:ORG_NAME/projects",
    "title": "Create a new project",
    "version": "0.1.0",
    "name": "CreateProject",
    "group": "Organization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ORG_NAME",
            "description": "<p>Organization's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>New project's name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "body Example:",
          "content": "{\n  \"title\": \"eeris\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "orgKey",
            "description": "<p>Organization's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project",
            "description": "<p>Project info.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Project successfully created!\",\n  \"project\": (...)\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/organization.js",
    "groupTitle": "Organization",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OrganizationNotFoundError",
            "description": "<p>The name of the Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoDataSentError",
            "description": "<p>No data sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AlreadyExistsError",
            "description": "<p>This payload already exists in this project.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "OrganizationNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"OrganizationNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "NoDataSentError:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"NoDataSentError\"\n}",
          "type": "json"
        },
        {
          "title": "AlreadyExistsError:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"error\": \"AlreadyExistsError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/:ORG_NAME/projects/:PROJECT_ID",
    "title": "Delete a specific project",
    "version": "0.1.0",
    "name": "DeleteProject",
    "group": "Organization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ORG_NAME",
            "description": "<p>Organization's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "orgKey",
            "description": "<p>Organization's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project",
            "description": "<p>Project info.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Project successfully deleted!\",\n  \"project\": (...)\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/organization.js",
    "groupTitle": "Organization",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OrganizationNotFoundError",
            "description": "<p>The name of the Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "OrganizationNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"OrganizationNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/:ORG_NAME/projects/:PROJECT_ID",
    "title": "Get info about a specific project",
    "version": "0.1.0",
    "name": "GetProjectInfo",
    "group": "Organization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ORG_NAME",
            "description": "<p>Organization's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "orgKey",
            "description": "<p>Organization's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project",
            "description": "<p>Project info.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"project\": (...)\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/organization.js",
    "groupTitle": "Organization",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OrganizationNotFoundError",
            "description": "<p>The name of the Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "OrganizationNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"OrganizationNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/:ORG_NAME/projects/:PROJECT_ID",
    "title": "Update a specific project",
    "version": "0.1.0",
    "name": "GetProjectInfo",
    "group": "Organization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ORG_NAME",
            "description": "<p>Organization's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "body example:",
          "content": "{\n  \"title\": (...),\n  \"organizationId\": (...),\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "orgKey",
            "description": "<p>Organization's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project",
            "description": "<p>Project info.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"message\": \"Project successfully updated!\",\n  \"project\": (...)\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/organization.js",
    "groupTitle": "Organization",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OrganizationNotFoundError",
            "description": "<p>The name of the Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotFoundError",
            "description": "<p>This key was not found in this project.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "OrganizationNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"OrganizationNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"KeyNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/:ORG_NAME/projects",
    "title": "Get all projects of an organization",
    "version": "0.1.0",
    "name": "GetProjects",
    "group": "Organization",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ORG_NAME",
            "description": "<p>Organization's name</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "orgKey",
            "description": "<p>Organization's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "projects",
            "description": "<p>Projects found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"projects\": [...]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/organization.js",
    "groupTitle": "Organization",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "OrganizationNotFoundError",
            "description": "<p>The name of the Organization was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "OrganizationNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"OrganizationNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/average",
    "title": "Average",
    "version": "0.1.0",
    "name": "QueryAvg",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\":  1.92\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/count",
    "title": "Count",
    "version": "0.1.0",
    "name": "QueryCount",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"count\": 153\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/count_unique",
    "title": "Count Unique",
    "version": "0.1.0",
    "name": "QueryCountUnique",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 9\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/extraction",
    "title": "Data Extraction",
    "version": "0.1.0",
    "name": "QueryExtraction",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 153,\n          \"current\": 3,\n          \"Note\": \"A note\",\n       },\n       {\n          \"voltage\": 123,\n          \"current\": 9,\n          \"Note\": \"A note\",\n       },\n       ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/maximum",
    "title": "Maximum",
    "version": "0.1.0",
    "name": "QueryMax",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 9.999\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/median",
    "title": "Median",
    "version": "0.1.0",
    "name": "QueryMedian",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\":  1.1\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/minimum",
    "title": "Minimum",
    "version": "0.1.0",
    "name": "QueryMin",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 0.0001\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/percentile",
    "title": "Percentile",
    "version": "0.1.0",
    "name": "QueryPercentile",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "0-100",
            "optional": false,
            "field": "percentile",
            "description": "<p>Desired percentile.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 0.945\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/select_unique",
    "title": "Select Unique",
    "version": "0.1.0",
    "name": "QuerySelectUnique",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       1.1,\n       4.546,\n       8.637,\n       ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/projects/:PROJECT_ID/queries/sum",
    "title": "Sum",
    "version": "0.1.0",
    "name": "QuerySum",
    "group": "Queries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PROJECT_ID",
            "description": "<p>Project's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "readkey/masterKey",
            "description": "<p>Key for authorized read.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event_collection",
            "description": "<p>Event collection.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "target_property",
            "description": "<p>Desired Event collection's property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "filters",
            "description": "<p>Apply custom filters.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "group_by",
            "description": "<p>Group by a property.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "latest",
            "defaultValue": "5000",
            "description": "<p>Limit events taken into account.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "minutely",
              "hourly",
              "daily",
              "weekly",
              "monthly",
              "yearly"
            ],
            "optional": true,
            "field": "interval",
            "description": "<p>Group by a time interval.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object/String",
            "allowedValues": [
              "\"{'start':ISOString, 'end':ISOString}\"",
              "\"[this|previous]_[n]_[seconds|minutes|days|...]\""
            ],
            "optional": true,
            "field": "timeframe",
            "description": "<p>Specify a timeframe.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "ok",
            "description": "<p>If the query succeded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "results",
            "description": "<p>Query result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 SUCCESS\n{\n  \"ok\": true\n  \"results\": [\n       {\n          \"voltage\": 337231\n       }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "server/routes/queries.js",
    "groupTitle": "Queries",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCredentialsSentError",
            "description": "<p>No key credentials sent.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "KeyNotAuthorizedError",
            "description": "<p>Key hasn't authorization.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFoundError",
            "description": "<p>The id of the Project was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TargetNotProvidedError",
            "description": "<p>The <code>target_property</code> parameter must be provided.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "NoCredentialsSentError:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": \"NoCredentialsSentError\"\n}",
          "type": "json"
        },
        {
          "title": "KeyNotAuthorizedError:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"error\": \"KeyNotAuthorizedError\"\n}",
          "type": "json"
        },
        {
          "title": "ProjectNotFoundError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"ProjectNotFoundError\"\n}",
          "type": "json"
        },
        {
          "title": "TargetNotProvidedError:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"TargetNotProvidedError\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
