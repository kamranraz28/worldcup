<?php

namespace App\Services;

use App\Models\Ticket;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Output\QRMarkupSVG;

class QrCodeService
{
    private function createQRCode(): QRCode
    {
        $options = new QROptions([
            'outputInterface' => QRMarkupSVG::class,
            'outputBase64' => false,
            'svgAddFillColor' => false,
            'drawLightModules' => false,
        ]);

        return new QRCode($options);
    }

    public function getMatrix(Ticket $ticket): array
    {
        $qrcode = $this->createQRCode();
        $qrcode->render($ticket->qr_code);
        return $qrcode->getQRMatrix()->getBooleanMatrix();
    }

    public function generate(Ticket $ticket): string
    {
        return $this->createQRCode()->render($ticket->qr_code);
    }

    public function generateForData(string $data): string
    {
        return $this->createQRCode()->render($data);
    }

    public function generateHtmlTable(Ticket $ticket): string
    {
        $matrix = $this->getMatrix($ticket);
        $size = count($matrix);
        $cellPx = 10;

        $html = '<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 0 auto; background: #ffffff;">';
        for ($y = 0; $y < $size; $y++) {
            $html .= '<tr>';
            for ($x = 0; $x < $size; $x++) {
                $dark = $matrix[$y][$x];
                $html .= '<td style="width:' . $cellPx . 'px;height:' . $cellPx . 'px;background:' . ($dark ? '#000' : '#fff') . ';padding:0;border:none;line-height:0;font-size:0;"></td>';
            }
            $html .= '</tr>';
        }
        $html .= '</table>';

        return $html;
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
