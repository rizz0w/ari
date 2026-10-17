Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageCropper
{
    public static void CropAndMakeTransparent(string srcPath, string dstPath)
    {
        using (Bitmap orig = new Bitmap(srcPath))
        {
            int w = orig.Width;
            int h = orig.Height;
            
            Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.DrawImage(orig, 0, 0, w, h);
            }

            Color corner = bmp.GetPixel(0, 0);
            int bgR = corner.R, bgG = corner.G, bgB = corner.B;

            bool[,] visited = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            for (int x = 0; x < w; x++)
            {
                queue.Enqueue(new Point(x, 0)); visited[x, 0] = true;
                queue.Enqueue(new Point(x, h - 1)); visited[x, h - 1] = true;
            }
            for (int y = 0; y < h; y++)
            {
                queue.Enqueue(new Point(0, y)); visited[0, y] = true;
                queue.Enqueue(new Point(w - 1, y)); visited[w - 1, y] = true;
            }

            int[] dx = { 1, -1, 0, 0 };
            int[] dy = { 0, 0, 1, -1 };

            while (queue.Count > 0)
            {
                Point pt = queue.Dequeue();
                int cx = pt.X;
                int cy = pt.Y;

                for (int i = 0; i < 4; i++)
                {
                    int nx = cx + dx[i];
                    int ny = cy + dy[i];

                    if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny])
                    {
                        Color c = bmp.GetPixel(nx, ny);
                        double lum = 0.299 * c.R + 0.587 * c.G + 0.114 * c.B;
                        bool isOutline = lum < 115 || (c.R < 110 && c.G < 90 && c.B < 80);

                        if (!isOutline)
                        {
                            visited[nx, ny] = true;
                            queue.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            int minX = w, maxX = 0, minY = h, maxY = 0;
            Color transparent = Color.FromArgb(0, 0, 0, 0);

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    if (visited[x, y])
                    {
                        bmp.SetPixel(x, y, transparent);
                    }
                    else
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            int pad = 10;
            int cropX = Math.Max(0, minX - pad);
            int cropY = Math.Max(0, minY - pad);
            int cropW = Math.Min(w - cropX, (maxX - minX) + pad * 2);
            int cropH = Math.Min(h - cropY, (maxY - minY) + pad * 2);

            Rectangle rect = new Rectangle(cropX, cropY, cropW, cropH);
            using (Bitmap cropped = bmp.Clone(rect, PixelFormat.Format32bppArgb))
            {
                cropped.Save(dstPath, ImageFormat.Png);
            }

            bmp.Dispose();
        }
    }
}
"@

[ImageCropper]::CropAndMakeTransparent("c:\dev\Coding\HTML\foca\foca.jpg", "c:\dev\Coding\HTML\foca\foca-recortada.png")
Write-Host "Done! Saved foca-recortada.png"
