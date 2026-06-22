using System;
using System.IO;
using System.Linq;
using Windows.Storage;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Globalization;

class Program {
    static void Main(string[] args) {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        if (args.Length == 0) {
            Console.WriteLine("Usage: ocr.exe <image_path>");
            return;
        }

        string filePath = Path.GetFullPath(args[0]);
        if (!File.Exists(filePath)) {
            Console.WriteLine("File not found: " + filePath);
            return;
        }

        try {
            var text = Recognize(filePath);
            Console.WriteLine(text);
        } catch (Exception ex) {
            Console.WriteLine("ERROR: " + ex.Message);
            if (ex.InnerException != null) {
                Console.WriteLine("INNER: " + ex.InnerException.Message);
            }
        }
    }

    static string Recognize(string filePath) {
        var file = System.WindowsRuntimeSystemExtensions.AsTask(StorageFile.GetFileFromPathAsync(filePath)).Result;
        using (var stream = System.WindowsRuntimeSystemExtensions.AsTask(file.OpenAsync(FileAccessMode.Read)).Result) {
            var decoder = System.WindowsRuntimeSystemExtensions.AsTask(BitmapDecoder.CreateAsync(stream)).Result;
            var bitmap = System.WindowsRuntimeSystemExtensions.AsTask(decoder.GetSoftwareBitmapAsync()).Result;
            var engine = OcrEngine.TryCreateFromLanguage(new Language("ja-JP"));
            if (engine == null) {
                engine = OcrEngine.TryCreateFromUserProfileLanguages();
            }
            var result = System.WindowsRuntimeSystemExtensions.AsTask(engine.RecognizeAsync(bitmap)).Result;
            return result.Text;
        }
    }
}
