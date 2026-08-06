using System;
using System.Drawing;
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

        var engine = OcrEngine.TryCreateFromLanguage(new Windows.Globalization.Language("ja-JP"));
        if (engine == null) engine = OcrEngine.TryCreateFromUserProfileLanguages();

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
                    text = text.Replace("\\", "\\\\").Replace("\r", "").Replace("\n", "").Replace("\"", "\\\"").Replace(" ", "");
                } catch (Exception ex) {
                    text = "ERROR: " + ex.Message;
                }
            }

            sb.AppendLine("  {\"dir\": \"" + dirName + "\", \"text\": \"" + text + "\"}" + (i < dirs.Length - 1 ? "," : ""));
            Console.WriteLine("Parsed " + (i + 1) + "/" + dirs.Length + ": " + dirName + " => " + text);
        }
        sb.AppendLine("]");
        File.WriteAllText(@"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\all_hero_folder_titles_ocr.json", sb.ToString(), Encoding.UTF8);
        Console.WriteLine("SUCCESS!");
    }

    static T AwaitOp<T>(IAsyncOperation<T> op) {
        while (op.Status == AsyncStatus.Started) {
            Thread.Sleep(5);
        }
        return op.GetResults();
    }

    static string ProcessFile(OcrEngine engine, string path) {
        // Load image using System.Drawing, crop title region (x: 1100 to 1450, y: 140 to 230), and convert to SoftwareBitmap
        using (Bitmap bmp = new Bitmap(path)) {
            int w = bmp.Width;
            int h = bmp.Height;
            
            // Scaled crop box if not 1920x1080
            int x1 = (int)(1100.0 * w / 1920.0);
            int y1 = (int)(140.0 * h / 1080.0);
            int cropW = (int)(350.0 * w / 1920.0);
            int cropH = (int)(90.0 * h / 1080.0);

            using (Bitmap cropped = new Bitmap(cropW, cropH)) {
                using (Graphics g = Graphics.FromImage(cropped)) {
                    g.DrawImage(bmp, new Rectangle(0, 0, cropW, cropH), new Rectangle(x1, y1, cropW, cropH), GraphicsUnit.Pixel);
                }
                
                string tempCropPath = Path.Combine(@"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch", "crop_temp.png");
                cropped.Save(tempCropPath, System.Drawing.Imaging.ImageFormat.Png);

                StorageFile file = AwaitOp(StorageFile.GetFileFromPathAsync(tempCropPath));
                var stream = AwaitOp(file.OpenAsync(FileAccessMode.Read));
                BitmapDecoder decoder = AwaitOp(BitmapDecoder.CreateAsync(stream));
                SoftwareBitmap bitmap = AwaitOp(decoder.GetSoftwareBitmapAsync());
                OcrResult result = AwaitOp(engine.RecognizeAsync(bitmap));
                return result.Text;
            }
        }
    }
}
