import os

base = r'C:\Users\81901\Pictures\Screenshots'
for d in os.listdir(base):
    if d.startswith("Set_032_"):
        old_p = os.path.join(base, d)
        new_p = os.path.join(base, "Set_032_高漸離_4298-4308")
        if old_p != new_p:
            os.rename(old_p, new_p)
            print(f"Renamed Set 032: '{d}' -> 'Set_032_高漸離_4298-4308'")
        break
