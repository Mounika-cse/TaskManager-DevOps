inventory=[("apple",15),
     ("mango",1),
           ("peas",15),
     ("melon",2),
    ]
lowstock=[]
for item in inventory:
    if item[1]<10:
        lowstock.append(item)
print("lowstock:",lowstock)
for lowitem in lowstock:
    print(f"{lowitem[0]}:{lowitem[1]}units")
    
