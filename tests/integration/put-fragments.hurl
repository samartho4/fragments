# Test updating a fragment
# First, create a fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Initial content`

# Capture the Location URL and fragment ID
HTTP/1.1 201
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# Now update the fragment
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Updated content`

# Verify successful update
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{id}}
jsonpath "$.fragment.size" == 15 # Length of "Updated content"
jsonpath "$.fragment.type" == "text/plain"

# GET the updated fragment to verify the content was updated
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Updated content"

# Try to update the fragment with a different content type
PUT {{url}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"key": "value"}`

# Verify we get a 400 Bad Request
HTTP/1.1 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Content-Type cannot be changed"

# Try to update a non-existent fragment
PUT http://localhost:8080/v1/fragments/non-existent-id
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This should fail`

# Verify we get a 404 Not Found
HTTP/1.1 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404