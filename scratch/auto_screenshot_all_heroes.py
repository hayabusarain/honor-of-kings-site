import subprocess
import time
import os

adb_path = r"C:\Program Files\BlueStacks_nxt\HD-Adb.exe"
save_dir = r"C:\Users\81901\Desktop\パッチノート更新分\auto_screenshots"
os.makedirs(save_dir, exist_ok=True)

def adb_tap(x, y):
    subprocess.run([adb_path, "-s", "emulator-5554", "shell", "input", "tap", str(x), str(y)])

def capture_screen(filename):
    filepath = os.path.join(save_dir, filename)
    proc = subprocess.run([adb_path, "-s", "emulator-5554", "exec-out", "screencap", "-p"], capture_output=True)
    with open(filepath, "wb") as f:
        f.write(proc.stdout)
    print(f"[SAVED] {filepath} ({len(proc.stdout)} bytes)")
    return filepath

def main():
    print("==========================================")
    print(" Honor of Kings BlueStacks Screen Capture ")
    print("==========================================")
    print(f"Screenshots will be saved to: {save_dir}")
    print("\nOptions:")
    print("1. Interactive Capture (Press ENTER to capture current screen & advance)")
    print("2. Interval Auto Capture (Automatically captures every N seconds)")
    print("3. Single Test Capture")
    
    choice = input("\nSelect mode (1, 2, or 3) [Default: 1]: ").strip() or "1"
    
    if choice == "3":
        capture_screen("test_capture.png")
        return
        
    if choice == "2":
        interval = float(input("Enter interval in seconds (e.g. 3.0): ").strip() or "3.0")
        count = int(input("How many screenshots to take? (e.g. 100): ").strip() or "100")
        print(f"\nStarting auto capture every {interval}s for {count} shots...")
        for i in range(1, count + 1):
            filename = f"hero_screen_{i:03d}.png"
            capture_screen(filename)
            time.sleep(interval)
        print("Auto capture complete!")
        return

    # Interactive mode (Mode 1)
    print("\n[Interactive Mode]")
    print("Press ENTER to take screenshot.")
    print("Type 'q' and press ENTER to quit.")
    
    index = 1
    while True:
        user_input = input(f"\nReady to capture #{index:03d}? (Press ENTER / 'q' to quit): ").strip()
        if user_input.lower() == 'q':
            break
        
        filename = f"hero_screen_{index:03d}.png"
        capture_screen(filename)
        index += 1

if __name__ == "__main__":
    main()
