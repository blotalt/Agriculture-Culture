<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Stores uploaded images on the public disk, shrunk to at most 1600px wide and
 * re-encoded as WebP. Falls back to storing the original file when the GD
 * extension is missing or the image can't be decoded.
 */
class ImageOptimizer
{
    public const MAX_WIDTH = 1600;
    public const QUALITY = 80;

    // Decoding needs about 4 bytes per pixel; skip resizing above this to stay within PHP's memory limit.
    public const MAX_PIXELS = 25_000_000;

    public function store(UploadedFile $file, string $folder): string
    {
        $size = @getimagesize($file->getRealPath());

        if (! $this->canOptimize() || ! $size || $size[0] * $size[1] > self::MAX_PIXELS) {
            return $file->store($folder, 'public');
        }

        $source = @imagecreatefromstring((string) file_get_contents($file->getRealPath()));

        if (! $source) {
            return $file->store($folder, 'public');
        }

        $width = imagesx($source);
        $height = imagesy($source);

        if ($width > self::MAX_WIDTH) {
            $resized = imagescale($source, self::MAX_WIDTH, (int) round($height * self::MAX_WIDTH / $width), IMG_BICUBIC);
            imagedestroy($source);
            $source = $resized;
        }

        // Keep transparency from PNGs and GIFs.
        imagepalettetotruecolor($source);
        imagealphablending($source, true);
        imagesavealpha($source, true);

        ob_start();
        imagewebp($source, null, self::QUALITY);
        $webp = ob_get_clean();
        imagedestroy($source);

        // Keep the original if re-encoding would make it bigger (already well compressed).
        if (! $webp || ($width <= self::MAX_WIDTH && strlen($webp) >= $file->getSize())) {
            return $file->store($folder, 'public');
        }

        $path = $folder.'/'.Str::random(40).'.webp';
        Storage::disk('public')->put($path, $webp);

        return $path;
    }

    public function canOptimize(): bool
    {
        return function_exists('imagecreatefromstring') && function_exists('imagewebp');
    }
}
