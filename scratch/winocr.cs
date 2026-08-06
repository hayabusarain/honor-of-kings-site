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
        string folder = @"C:\Users\81901\Pictures\Screenshots";
        string[] files = Directory.GetFiles(folder, "*.png", SearchOption.AllDirectories);
        Array.Sort(files);

        var engine = OcrEngine.TryCreateFromUserProfileLanguages();

        StringBuilder sb = new StringBuilder();
        sb.AppendLine("[");

        for (int i = 0; i < files.Length; i++) {
            string file = files[i];
            string filename = Path.GetFileName(file);
            try {
                string text = ProcessFile(engine, file);
                text = text.Replace("\\", "\\\\").Replace("\r", " ").Replace("\n", " ").Replace("\"", "\\\"");
                sb.AppendLine("  {\"filename\": \"" + filename + "\", \"text\": \"" + text + "\"}" + (i < files.Length - 1 ? "," : ""));
                Console.WriteLine("Parsed " + (i + 1) + "/" + files.Length + ": " + filename);
            } catch (Exception ex) {
                Console.WriteLine("Error " + filename + ": " + ex.Message);
            }
        }
        sb.AppendLine("]");
        File.WriteAllText(@"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\all_screenshots_ocr_recursive.json", sb.ToString(), Encoding.UTF8);
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
