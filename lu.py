m=int(input("Enter upper limit:"))
n=int(input("Enter lower limit:"))
for i in range(n,m+1):
    k=0
    for j in range(1,i+1):
        if(i%j==0):
            k=k+1
    if(k==2):
        print(i)
