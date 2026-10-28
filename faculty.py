faculty_list=[(101,"Poorna","CSE"),
              (102,"suma","eee"),
              (103,"suu","CSE")]
search_department=input("Enter:")
faculty_in_department=[faculty for faculty in faculty_list if faculty[2]==search_department]
print("faculty in",search_department,"department")
for faculty in faculty_in_department:
    print("ID",faculty[0])
