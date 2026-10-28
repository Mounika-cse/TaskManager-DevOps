def place_order(item,quantity=1,Shipping="standard"):
    print(f"Order details:\nItem:{item}\nQuantity:{quantity}\nShipping:{Shipping}")
place_order("laptop")
place_order("Iphone",2)
place_order("Earpods",6,"Cash on delivery")
