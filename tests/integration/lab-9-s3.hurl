# Test to verify S3 integration is working correctly

# 1. POST a new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# Verify we get a 201 Created response
HTTP/1.1 201
[Asserts]
# Capture the Location header for future requests
[Captures]
url: header "Location"

# 2. GET the fragment using the captured URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Verify we get a 200 OK response with the correct content type and body
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Hello S3!"

# 3. DELETE the fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Verify DELETE was successful with 200 OK
HTTP/1.1 200

# 4. Try to GET the deleted fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Verify we get a 404 Not Found since the fragment is deleted
HTTP/1.1 404