import os
import shutil

def main():
    screenshots_dir = r'C:\Users\81901\Desktop\オナキンENヒーロー\Screenshots'
    
    if not os.path.exists(screenshots_dir):
        print(f"Directory not found: {screenshots_dir}")
        return

    # Look for folders starting with "新しいフォルダー"
    folders = [f for f in os.listdir(screenshots_dir) 
               if os.path.isdir(os.path.join(screenshots_dir, f)) and f.startswith("新しいフォルダー")]
    
    moved_count = 0
    deleted_folders = 0

    for folder in folders:
        folder_path = os.path.join(screenshots_dir, folder)
        files = os.listdir(folder_path)
        
        for file in files:
            src = os.path.join(folder_path, file)
            dst = os.path.join(screenshots_dir, file)
            
            # Avoid overwriting existing files in the root folder
            if not os.path.exists(dst):
                shutil.move(src, dst)
                moved_count += 1
            else:
                # If file exists, add a suffix
                name, ext = os.path.splitext(file)
                new_dst = os.path.join(screenshots_dir, f"{name}_{folder}{ext}")
                shutil.move(src, new_dst)
                moved_count += 1
                
        # Delete the empty folder
        try:
            os.rmdir(folder_path)
            deleted_folders += 1
        except Exception as e:
            print(f"Could not delete {folder_path}: {e}")

    print(f"Successfully moved {moved_count} files from {deleted_folders} folders.")

if __name__ == '__main__':
    main()
