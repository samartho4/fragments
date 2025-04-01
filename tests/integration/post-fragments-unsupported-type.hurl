# Test posting a fragment with unsupported Content-Type
POST http://localhost:8080/v1/fragments
# Use an unsupported Content-Type
Content-Type: application/pdf
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request
`This is a PDF document content that should be rejected`

# We expect to get back an HTTP 415 Unsupported Media Type
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" matches ".*[Uu]nsupported.*"