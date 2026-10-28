cart={}
cart["kiwi"]={"price":100,"quantity":3}
cart["straw"]={"price":300,"quantity":4}
for item,details in cart.items():
    print(f"Item:{item},price:{details['price']},quantity:{details['quantity']}")
total=sum(item["price"]*item["quantity"] for item in cart.values())
print(total)
