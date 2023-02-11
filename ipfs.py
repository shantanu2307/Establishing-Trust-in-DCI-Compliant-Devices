import ipfshttpclient

api = ipfshttpclient.connect()

# Upload a file
# res = api.add("test.txt")

hash = "Qmb3mAPJf2YCBqZ6QrQM79sZR2dYd37A3JmJmDisJ55X6z"

res = api.cat(hash)

print(res)
