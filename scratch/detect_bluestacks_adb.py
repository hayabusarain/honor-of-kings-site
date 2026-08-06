import subprocess
import os

def check_adb():
    print("Checking ADB devices...")
    ports = [5555, 5554, 5556, 5575, 62001, 5558]
    connected = []
    
    for port in ports:
        try:
            res = subprocess.run(f"adb connect 127.0.0.1:{port}", shell=True, capture_output=True, text=True, timeout=3)
            print(f"Port {port}: {res.stdout.strip()}")
            if "connected" in res.stdout.lower():
                connected.append(port)
        except Exception as e:
            pass

    res = subprocess.run("adb devices", shell=True, capture_output=True, text=True)
    print("\nADB Devices Output:")
    print(res.stdout)

if __name__ == "__main__":
    check_adb()
