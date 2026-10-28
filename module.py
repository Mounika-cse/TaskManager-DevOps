def count_statistics(file_name):
    with open(file_name,'r') as file:
        lines=file.readlines()
        print(f"Lines:{len(lines)}")
        print(f"words:{sum(len(line.split()) for line in lines)}")
        print(f"characters:{sum(len(line)for line in lines)}")
count_statistics("example.txt")
        
