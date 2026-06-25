<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileStorageService
{
    public function upload(UploadedFile $file, string $directory = 'uploads', ?string $name = null): string
    {
        $filename = ($name ?: Str::random(20)) . '.' . $file->getClientOriginalExtension();

        return $file->storeAs($directory, $filename, 'public');
    }

    public function delete(?string $path): bool
    {
        if (empty($path)) {
            return false;
        }

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    public function url(string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    public function temporaryUrl(string $path, int $minutes = 60): ?string
    {
        if (empty($path)) {
            return null;
        }

        return Storage::disk('public')->temporaryUrl($path, now()->addMinutes($minutes));
    }

    public function exists(string $path): bool
    {
        return Storage::disk('public')->exists($path);
    }

    public function size(string $path): ?int
    {
        if (!$this->exists($path)) {
            return null;
        }

        return Storage::disk('public')->size($path);
    }

    public function mimeType(string $path): ?string
    {
        if (!$this->exists($path)) {
            return null;
        }

        return Storage::disk('public')->mimeType($path);
    }
}
