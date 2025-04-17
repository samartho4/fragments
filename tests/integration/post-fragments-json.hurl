# Test posting a JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
# JSON body needs to be valid JSON
`{"key1":"value1","key2":"value2"}`

# We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
# Capture the fragment URL and ID for the next request
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# GET the fragment we just created to verify it's returned correctly
GET {{url}}
[BasicAuth]
user1@email.com:password1
