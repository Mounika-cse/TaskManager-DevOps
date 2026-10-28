c={}
c["John"]=1000
c["bon"]=900
print("John balance",c.get("John","customer not found"))
c["John"]+=1000
print("Johns new balance",c["John"])
if c["John"]>=2000:
    c["John"]-=1000
    print(c["John"])
else:
    print("no")
if c["John"]>=200:
    c["John"]-=500
    c["bon"]+=500
    print(c["John"])
    print(c["bon"])
else:
    print("no")
del c["John"]
print(c)
