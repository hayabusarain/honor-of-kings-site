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

        for (int i = 0; i < dirs.Length; i++) {
            string dir = dirs[i];
            string dirName = Path.GetFileName(dir);
            string[] pngs = Directory.GetFiles(dir, "*.png");
            Array.Sort(pngs);

            string text = "";
            if (pngs.Length > 0) {
                try {
                    text = ProcessFile(engine, pngs[0]);
                    text = text.Replace("\\", "\\\\").Replace("\r", " ").Replace("\n", " ").Replace("\"", "\\\"");
                } catch (Exception ex) {
                    text = "ERROR: " + ex.Message;
                }
            }

            sb.AppendLine("  {\"dir\": \"" + dirName + "\", \"text\": \"" + text + "\"}" + (i < dirs.Length - 1 ? "," : ""));
            Console.WriteLine("Parsed " + (i + 1) + "/" + dirs.Length + ": " + dirName + " -> " + text);
        }
        sb.AppendLine("]");
        File.WriteAllText(@"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\all_hero_folder_ocr.json", sb.ToString(), Encoding.UTF8);
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
