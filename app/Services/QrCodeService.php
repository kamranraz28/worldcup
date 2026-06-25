<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Support\Str;

class QrCodeService
{
    public function generate(Ticket $ticket): string
    {
        $data = json_encode([
            'ticket' => $ticket->uuid,
            'event' => $ticket->event_id,
            'qr' => $ticket->qr_code,
            'type' => $ticket->ticket_type,
        ]);

        return $this->generateSvg($data);
    }

    public function generateForData(string $data): string
    {
        return $this->generateSvg($data);
    }

    private function generateSvg(string $data): string
    {
        $hash = md5($data);
        $size = 25;
        $scale = 10;
        $matrix = $this->generateMatrix($hash, $size);

        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . ($size * $scale) . ' ' . ($size * $scale) . '" width="' . ($size * $scale) . '" height="' . ($size * $scale) . '">';
        $svg .= '<rect width="100%" height="100%" fill="white" rx="4"/>';

        for ($row = 0; $row < $size; $row++) {
            for ($col = 0; $col < $size; $col++) {
                if ($matrix[$row][$col]) {
                    $x = $col * $scale;
                    $y = $row * $scale;
                    $svg .= '<rect x="' . $x . '" y="' . $y . '" width="' . $scale . '" height="' . $scale . '" fill="#E30613" rx="1"/>';
                }
            }
        }

        $center = ($size / 2) * $scale - ($scale * 3);
        $svg .= '<rect x="' . $center . '" y="' . $center . '" width="' . ($scale * 6) . '" height="' . ($scale * 6) . '" fill="white" rx="3"/>';
        $svg .= '<rect x="' . ($center + $scale) . '" y="' . ($center + $scale) . '" width="' . ($scale * 4) . '" height="' . ($scale * 4) . '" fill="#E30613" rx="2"/>';

        $svg .= '</svg>';

        return $svg;
    }

    private function generateMatrix(string $hash, int $size): array
    {
        $matrix = array_fill(0, $size, array_fill(0, $size, false));

        for ($i = 0; $i < $size; $i++) {
            for ($j = 0; $j < $size; $j++) {
                $charIndex = ($i * $size + $j) % strlen($hash);
                $char = ord($hash[$charIndex]);
                $matrix[$i][$j] = ($char % 3) !== 0;
            }
        }

        for ($i = 0; $i < 7; $i++) {
            for ($j = 0; $j < 7; $j++) {
                $matrix[$i][$j] = !($i === 0 || $i === 6 || $j === 0 || $j === 6 || ($i === 1 && $j === 1) || ($i === 1 && $j === 5) || ($i === 5 && $j === 1) || ($i === 5 && $j === 5));
                $matrix[$i][$size - 1 - $j] = !($i === 0 || $i === 6 || $j === 0 || $j === 6 || ($i === 1 && $j === 1) || ($i === 1 && $j === 5) || ($i === 5 && $j === 1) || ($i === 5 && $j === 5));
                $matrix[$size - 1 - $i][$j] = !($i === 0 || $i === 6 || $j === 0 || $j === 6 || ($i === 1 && $j === 1) || ($i === 1 && $j === 5) || ($i === 5 && $j === 1) || ($i === 5 && $j === 5));
            }
        }

        return $matrix;
    }

    public function saveToFile(Ticket $ticket): string
    {
        $svg = $this->generate($ticket);
        $filename = 'qrcodes/' . $ticket->uuid . '.svg';
        $path = storage_path('app/public/' . $filename);

        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, $svg);

        return $filename;
    }
}
