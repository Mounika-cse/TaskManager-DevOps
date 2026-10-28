string="aaaaaabbbbcccc"
n=2
counts={}
for c in string:
    counts[c]=counts[c]+1 if c in counts else 1
top=sorted(counts.items(),key=lambda x:-x[1])[:n]
print([(k,v) for k,v in top])
