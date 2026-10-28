def group_values_zip(*iterables):
    return list(zip(*iterables))
iterable1=[1,2,3]
iterable2=['a','b','c']
iterable3=['mouni','prasu','liki']
result=group_values_zip(iterable1,iterable2,iterable3)
print(result)
