using System;
using System.IO;
using System.Text;
using System.Threading;
using Windows.Foundation;
using Windows.Media.Ocr;
using Windows.Graphics.Imaging;
using Windows.Storage;

class Program {
    static void Main(string[] args) {
        Console.OutputEncoding = Encoding.UTF8;
        string baseFolder = @"C:\Users\81901\Pictures\Screenshots";
        string[] dirs = Directory.GetDirectories(baseFolder);
        Array.Sort(dirs);

        var engine = OcrEngine.TryCreateFromUserProfileLanguages();

        StringBuilder sb = new StringBuilder();
        sb.AppendLine("[");

        bool firstDir = true;
        for (int i = 0; i < dirs.Length; i++) {
            string dir = dirs[i];
            string dirName = Path.GetFileName(dir);
            if (!dirName.StartsWith("Set_")) continue;
            
            // Only process Set_100 to Set_113
            string[] parts = dirName.Split('_');
            if (parts.Length < 2) continue;
            int setNum = 0;
            if (!int.TryParse(parts[1], out setNum)) continue;
            if (setNum < 100 || setNum > 113) continue;

            string[] pngs = Directory.GetFiles(dir, "*.png");
            Array.Sort(pngs);

            if (!firstDir) {
                sb.AppendLine(",");
            }
            firstDir = false;
            
            sb.AppendLine("  {");
            sb.AppendLine("    \"dir\": \"" + dirName + "\",");
            sb.AppendLine("    \"images\": [");

            for (int j = 0; j < pngs.Length; j++) {
                string text = "";
                try {
                    text = ProcessFile(engine, pngs[j]);
                    text = text.Replace("\\", "\\\\").Replace("\r", " ").Replace("\n", " ").Replace("\"", "\\\"");
                } catch (Exception ex) {
                    text = "ERROR: " + ex.Message.Replace("\\", "\\\\").Replace("\r", " ").Replace("\n", " ").Replace("\"", "\\\"");
                }
                sb.Append("      {\"filename\": \"" + Path.GetFileName(pngs[j]) + "\", \"text\": \"" + text + "\"}");
                if (j < pngs.Length - 1) sb.AppendLine(",");
                else sb.AppendLine();
            }
            sb.AppendLine("    ]");
            sb.Append("  }");
            Console.WriteLine("Parsed: " + dirName);
        }
        sb.AppendLine();
        sb.AppendLine("]");
        File.WriteAllText(@"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_part10_raw.json", sb.ToString(), new UTF8Encoding(false));
        Console.WriteLine("SUCCESS!");
    }

    static T AwaitOp<T>(IAsyncOperation<T> op) {
        while (op.Status == AsyncStatus.Started) {
            Thread.Sleep(5);
        }
        return op.GetResults();
    }

    static string ProcessFile(OcrEngine engine, string path) {
        StorageFile file = AwaitOp(StorageFile.GetFileFromPathAsync(path));
        var stream = AwaitOp(file.OpenAsync(FileAccessMode.Read));
        BitmapDecoder decoder = AwaitOp(BitmapDecoder.CreateAsync(stream));
        SoftwareBitmap bitmap = AwaitOp(decoder.GetSoftwareBitmapAsync());
        OcrResult result = AwaitOp(engine.RecognizeAsync(bitmap));
        return result.Text;
    }
}
