stored_username="admin"
stored_password="secure@123"
username=input("Enter your user:")
password=input("Enter your pass:")
if username.lower()==stored_username and password==stored_password:
    print("Success")
else:
    print("Invalid")
