# Test posting a fragment without authentication
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
# No authentication credentials
`This should be rejected because it's not authenticated`

# We expect to get back an HTTP 401 Unauthorized
HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"