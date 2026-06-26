<?php

namespace App\Providers;

use App\Models\SystemConfig;
use Illuminate\Support\ServiceProvider;

class MailConfigServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('system_configs')) {
                return;
            }

            $fetch = function (string $key, $default = null) {
                return SystemConfig::getValue('smtp.' . $key, $default);
            };

            $host = $fetch('mail_host');
            if (!$host) {
                return;
            }

            config([
                'mail.default' => $fetch('mail_driver', 'smtp'),
                'mail.mailers.smtp.host' => $host,
                'mail.mailers.smtp.port' => (int) $fetch('mail_port', 587),
                'mail.mailers.smtp.username' => $fetch('mail_username'),
                'mail.mailers.smtp.password' => $fetch('mail_password'),
                'mail.mailers.smtp.encryption' => $fetch('mail_encryption', 'tls') ?: null,
                'mail.from.address' => $fetch('mail_from_address', 'noreply@toffee.com'),
                'mail.from.name' => $fetch('mail_from_name', 'Toffee World Cup'),
            ]);
        } catch (\Exception $e) {
            return;
        }
    }
}
