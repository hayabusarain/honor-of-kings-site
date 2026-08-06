import subprocess

adb = r"C:\Program Files\BlueStacks_nxt\HD-Adb.exe"
proc = subprocess.run([adb, "-s", "emulator-5554", "exec-out", "screencap", "-p"], capture_output=True)

target1 = r"scratch\bluestacks_clean.png"
target2 = r"C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\bluestacks_clean.png"

with open(target1, "wb") as f:
    f.write(proc.stdout)

with open(target2, "wb") as f:
    f.write(proc.stdout)

print(f"SUCCESS: Saved clean PNG ({len(proc.stdout)} bytes)!")
