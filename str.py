list1=[1,2,3]
list2=[4,5,6]
combinedlist=list1+list2
print("combinedlist:",combinedlist)
repeatedlist=list1*3
print("repeated:",repeatedlist)
slicedlist=combinedlist[1:3]
print("sliced",slicedlist)
del combinedlist[2]
print(combinedlist)
