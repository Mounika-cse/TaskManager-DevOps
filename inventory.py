inventory=[
    ("laptop",15),
     ("mouse",2),
    ("cpu",14),
     ("joystick",9),
    ("pen",8),
     ("keyboard",6),
    ("wires",1),
     ("vga",3),
    ]
lowstock=[item for item,qty in inventory if qty<10]
print("lowstock:",lowstock)
