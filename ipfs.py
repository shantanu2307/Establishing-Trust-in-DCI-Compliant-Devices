import ipfshttpclient

api = ipfshttpclient.connect()

# print(api)

# res = api.add("./text.txt")

# hash = "QmNjhN1mcrAH8CSobaedEw6LeNnKqr7U9Q8pfXiBTRBVhD"

res = api.get(hash)

print(res)
