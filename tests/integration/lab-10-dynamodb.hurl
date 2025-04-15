# Comprehensive Fragments API Integration Test

# 1. POST a JSON fragment with valid content
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{"service": "DynamoDB", "description": "Cloud database service"}
# Verify successful creation
HTTP/1.1 201
[Asserts]
header "Location" exists
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" > 0
[Captures]
json_fragment_url: header "Location"
json_fragment_id: jsonpath "$.fragment.id"

# 2. Verify fragment info for the JSON fragment
GET {{json_fragment_url}}/info
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{json_fragment_id}}
jsonpath "$.fragment.type" == "application/json"






# 3. DELETE the JSON fragment
DELETE {{json_fragment_url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"




# 4. GET fragments list after deletion
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes {{json_fragment_id}}


# 5. Attempt to access fragments without authentication
GET http://localhost:8080/v1/fragments
HTTP/1.1 401

# 6. Attempt to create fragment without authentication
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
HTTP/1.1 401


