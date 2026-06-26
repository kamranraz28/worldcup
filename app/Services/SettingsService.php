<?php

namespace App\Services;

use App\Models\SystemConfig;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SettingsService
{
    private $cacheKey = 'system_settings';
    private $cacheTtl = 3600;

    public function all(): array
    {
        return Cache::remember($this->cacheKey, $this->cacheTtl, function () {
            return SystemConfig::all()->pluck('value', 'key')->toArray();
        });
    }

    public function get(string $key, $default = null)
    {
        return SystemConfig::getValue($key, $default);
    }

    public function set(string $key, $value, string $type = 'string', ?string $description = null): void
    {
        SystemConfig::setValue($key, $value, $type, $description);
        $this->clearCache();
    }

    public function updateGroup(string $group, array $values): void
    {
        $rules = $this->getValidationRules($group);
        $validator = Validator::make($values, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        foreach ($values as $key => $value) {
            $fullKey = $group . '.' . $key;
            $config = $this->getConfigDefinition($fullKey);
            SystemConfig::setValue(
                $fullKey,
                $value,
                $config['type'] ?? 'string',
                $config['description'] ?? null
            );
        }

        $this->clearCache();
    }

    public function getGroup(string $group): array
    {
        $configs = SystemConfig::where('key', 'like', $group . '.%')->get();
        $settings = [];
        foreach ($configs as $config) {
            $localKey = str_replace($group . '.', '', $config->key);
            $settings[$localKey] = SystemConfig::getValue($config->key);
        }
        return $settings;
    }

    public function getGroupDefinitions(): array
    {
        return [
            'general' => [
                'label' => 'General',
                'icon' => 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                'fields' => $this->getGeneralFields(),
            ],
            'brand' => [
                'label' => 'Brand',
                'icon' => 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
                'fields' => $this->getBrandFields(),
            ],
            'smtp' => [
                'label' => 'SMTP',
                'icon' => 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                'fields' => $this->getSmtpFields(),
            ],
            'sms' => [
                'label' => 'SMS',
                'icon' => 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
                'fields' => $this->getSmsFields(),
            ],
            'api' => [
                'label' => 'API',
                'icon' => 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                'fields' => $this->getApiFields(),
            ],
            'theme' => [
                'label' => 'Theme',
                'icon' => 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
                'fields' => $this->getThemeFields(),
            ],
            'qr' => [
                'label' => 'QR Code',
                'icon' => 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
                'fields' => $this->getQrFields(),
            ],
            'security' => [
                'label' => 'Security',
                'icon' => 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
                'fields' => $this->getSecurityFields(),
            ],
            'maintenance' => [
                'label' => 'Maintenance',
                'icon' => 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
                'fields' => $this->getMaintenanceFields(),
            ],
        ];
    }

    private function getGeneralFields(): array
    {
        return [
            'app_name' => ['label' => 'Application Name', 'type' => 'text', 'default' => 'Toffee World Cup 2026', 'description' => 'The name displayed throughout the application'],
            'app_url' => ['label' => 'Application URL', 'type' => 'text', 'default' => url('/'), 'description' => 'Base URL of the application'],
            'timezone' => ['label' => 'Timezone', 'type' => 'select', 'default' => 'Asia/Dhaka', 'options' => ['UTC', 'Asia/Dhaka', 'Asia/Dubai', 'Asia/Riyadh', 'America/New_York', 'Europe/London'], 'description' => 'Default timezone for the application'],
            'locale' => ['label' => 'Locale', 'type' => 'select', 'default' => 'en', 'options' => ['en' => 'English', 'ar' => 'Arabic', 'ur' => 'Urdu'], 'description' => 'Default language'],
            'currency' => ['label' => 'Currency', 'type' => 'select', 'default' => 'BDT', 'options' => ['BDT', 'USD', 'EUR', 'GBP', 'AED', 'SAR'], 'description' => 'Default currency for ticket pricing'],
            'date_format' => ['label' => 'Date Format', 'type' => 'select', 'default' => 'M d, Y', 'options' => ['M d, Y' => 'Jan 15, 2026', 'd M Y' => '15 Jan 2026', 'Y-m-d' => '2026-01-15', 'd/m/Y' => '15/01/2026'], 'description' => 'Display format for dates'],
            'pagination_per_page' => ['label' => 'Items Per Page', 'type' => 'number', 'default' => '15', 'description' => 'Number of items shown per page in listings'],
            'enable_registration' => ['label' => 'Enable Registration', 'type' => 'boolean', 'default' => 'true', 'description' => 'Allow new user registrations'],
        ];
    }

    private function getBrandFields(): array
    {
        return [
            'primary_color' => ['label' => 'Primary Color', 'type' => 'color', 'default' => '#E30613', 'description' => 'Main brand color (Toffee Red)'],
            'secondary_color' => ['label' => 'Secondary Color', 'type' => 'color', 'default' => '#FFD54F', 'description' => 'Secondary brand color (Gold)'],
            'accent_color' => ['label' => 'Accent Color', 'type' => 'color', 'default' => '#16A34A', 'description' => 'Accent color (Football Green)'],
            'company_name' => ['label' => 'Company Name', 'type' => 'text', 'default' => 'Toffee', 'description' => 'Your company or organization name'],
            'company_logo' => ['label' => 'Company Logo URL', 'type' => 'text', 'default' => '', 'description' => 'URL or path to your logo image'],
            'favicon' => ['label' => 'Favicon URL', 'type' => 'text', 'default' => '', 'description' => 'URL to favicon image'],
            'footer_text' => ['label' => 'Footer Text', 'type' => 'text', 'default' => 'Toffee — Official Partner FIFA World Cup 2026', 'description' => 'Text displayed in page footers'],
            'copyright' => ['label' => 'Copyright', 'type' => 'text', 'default' => '© 2026 Toffee. All rights reserved.', 'description' => 'Copyright notice'],
        ];
    }

    private function getSmtpFields(): array
    {
        return [
            'mail_driver' => ['label' => 'Mail Driver', 'type' => 'select', 'default' => 'smtp', 'options' => ['smtp' => 'SMTP', 'sendmail' => 'Sendmail', 'mailgun' => 'Mailgun', 'ses' => 'SES', 'log' => 'Log'], 'description' => 'Email sending driver'],
            'mail_host' => ['label' => 'SMTP Host', 'type' => 'text', 'default' => '', 'description' => 'SMTP server hostname'],
            'mail_port' => ['label' => 'SMTP Port', 'type' => 'number', 'default' => '587', 'description' => 'SMTP server port'],
            'mail_username' => ['label' => 'SMTP Username', 'type' => 'text', 'default' => '', 'description' => 'SMTP authentication username'],
            'mail_password' => ['label' => 'SMTP Password', 'type' => 'password', 'default' => '', 'description' => 'SMTP authentication password'],
            'mail_encryption' => ['label' => 'Encryption', 'type' => 'select', 'default' => 'tls', 'options' => ['tls' => 'TLS', 'ssl' => 'SSL', '' => 'None'], 'description' => 'SMTP encryption protocol'],
            'mail_from_address' => ['label' => 'From Address', 'type' => 'email', 'default' => 'noreply@toffee.com', 'description' => 'Default sender email address'],
            'mail_from_name' => ['label' => 'From Name', 'type' => 'text', 'default' => 'Toffee World Cup', 'description' => 'Default sender name'],
        ];
    }

    private function getSmsFields(): array
    {
        return [
            'sms_driver' => ['label' => 'SMS Driver', 'type' => 'select', 'default' => 'nexmo', 'options' => ['nexmo' => 'Vonage/Nexmo', 'twilio' => 'Twilio', 'log' => 'Log'], 'description' => 'SMS service provider'],
            'nexmo_key' => ['label' => 'Vonage API Key', 'type' => 'text', 'default' => '', 'description' => 'Vonage/Nexmo API key'],
            'nexmo_secret' => ['label' => 'Vonage API Secret', 'type' => 'password', 'default' => '', 'description' => 'Vonage/Nexmo API secret'],
            'nexmo_from' => ['label' => 'SMS From Number', 'type' => 'text', 'default' => 'Toffee', 'description' => 'Sender ID or phone number'],
            'twilio_sid' => ['label' => 'Twilio SID', 'type' => 'text', 'default' => '', 'description' => 'Twilio Account SID'],
            'twilio_token' => ['label' => 'Twilio Auth Token', 'type' => 'password', 'default' => '', 'description' => 'Twilio authentication token'],
            'twilio_from' => ['label' => 'Twilio From Number', 'type' => 'text', 'default' => '', 'description' => 'Twilio phone number'],
            'sms_enabled' => ['label' => 'Enable SMS', 'type' => 'boolean', 'default' => 'false', 'description' => 'Globally enable or disable SMS sending'],
        ];
    }

    private function getApiFields(): array
    {
        return [
            'api_rate_limit' => ['label' => 'Rate Limit (per minute)', 'type' => 'number', 'default' => '60', 'description' => 'Maximum API requests per minute per IP'],
            'api_rate_limit_auth' => ['label' => 'Authenticated Rate Limit', 'type' => 'number', 'default' => '120', 'description' => 'Maximum API requests per minute for authenticated users'],
            'api_version' => ['label' => 'API Version', 'type' => 'text', 'default' => 'v1', 'description' => 'Current API version prefix'],
            'api_debug' => ['label' => 'API Debug Mode', 'type' => 'boolean', 'default' => 'false', 'description' => 'Include debug data in API responses'],
            'cors_allowed_origins' => ['label' => 'CORS Allowed Origins', 'type' => 'text', 'default' => '*', 'description' => 'Comma-separated list of allowed origins'],
            'cors_allowed_methods' => ['label' => 'CORS Allowed Methods', 'type' => 'text', 'default' => 'GET,POST,PUT,DELETE,PATCH', 'description' => 'Comma-separated list of allowed HTTP methods'],
            'enable_api_docs' => ['label' => 'Enable API Documentation', 'type' => 'boolean', 'default' => 'true', 'description' => 'Show API documentation endpoint'],
            'api_token_expiry' => ['label' => 'API Token Expiry (days)', 'type' => 'number', 'default' => '365', 'description' => 'Number of days before API tokens expire'],
        ];
    }

    private function getThemeFields(): array
    {
        return [
            'default_theme' => ['label' => 'Default Theme', 'type' => 'select', 'default' => 'dark', 'options' => ['dark' => 'Dark', 'light' => 'Light', 'system' => 'System Default'], 'description' => 'Default theme mode for new users'],
            'sidebar_collapsed' => ['label' => 'Sidebar Collapsed by Default', 'type' => 'boolean', 'default' => 'false', 'description' => 'Start with sidebar minimized'],
            'enable_animations' => ['label' => 'Enable Animations', 'type' => 'boolean', 'default' => 'true', 'description' => 'Enable Framer Motion page transitions'],
            'glass_opacity' => ['label' => 'Glassmorphism Opacity', 'type' => 'range', 'default' => '0.03', 'min' => 0, 'max' => 0.15, 'step' => 0.01, 'description' => 'Background opacity for glass panels'],
            'border_opacity' => ['label' => 'Border Opacity', 'type' => 'range', 'default' => '0.1', 'min' => 0.02, 'max' => 0.3, 'step' => 0.02, 'description' => 'Border opacity for glass panels'],
            'font_family' => ['label' => 'Font Family', 'type' => 'select', 'default' => 'Inter', 'options' => ['Inter' => 'Inter', 'Poppins' => 'Poppins', 'Manrope' => 'Manrope', 'System' => 'System Default'], 'description' => 'Primary font family'],
            'border_radius' => ['label' => 'Border Radius Scale', 'type' => 'select', 'default' => 'xl', 'options' => ['sm' => 'Small (4px)', 'md' => 'Medium (8px)', 'lg' => 'Large (12px)', 'xl' => 'Extra Large (16px)'], 'description' => 'Default border radius for cards and panels'],
            'custom_css' => ['label' => 'Custom CSS', 'type' => 'textarea', 'default' => '', 'description' => 'Additional custom CSS injected into the app'],
        ];
    }

    private function getQrFields(): array
    {
        return [
            'qr_size' => ['label' => 'QR Code Size', 'type' => 'number', 'default' => '250', 'description' => 'QR code image size in pixels'],
            'qr_foreground_color' => ['label' => 'Foreground Color', 'type' => 'color', 'default' => '#E30613', 'description' => 'QR code dot color'],
            'qr_background_color' => ['label' => 'Background Color', 'type' => 'color', 'default' => '#FFFFFF', 'description' => 'QR code background color'],
            'qr_error_correction' => ['label' => 'Error Correction', 'type' => 'select', 'default' => 'M', 'options' => ['L' => 'Low (7%)', 'M' => 'Medium (15%)', 'Q' => 'Quartile (25%)', 'H' => 'High (30%)'], 'description' => 'QR code error correction level'],
            'qr_include_logo' => ['label' => 'Include Logo', 'type' => 'boolean', 'default' => 'false', 'description' => 'Embed Toffee logo in center of QR code'],
            'qr_logo_size' => ['label' => 'Logo Size (px)', 'type' => 'number', 'default' => '40', 'description' => 'Size of the embedded logo in pixels'],
            'qr_margin' => ['label' => 'Margin', 'type' => 'number', 'default' => '2', 'description' => 'QR code margin in modules'],
            'qr_format' => ['label' => 'QR Format', 'type' => 'select', 'default' => 'svg', 'options' => ['svg' => 'SVG', 'png' => 'PNG'], 'description' => 'Output format for generated QR codes'],
        ];
    }

    private function getSecurityFields(): array
    {
        return [
            'password_min_length' => ['label' => 'Minimum Password Length', 'type' => 'number', 'default' => '8', 'description' => 'Minimum characters for user passwords'],
            'password_require_uppercase' => ['label' => 'Require Uppercase', 'type' => 'boolean', 'default' => 'true', 'description' => 'Passwords must contain uppercase letters'],
            'password_require_numbers' => ['label' => 'Require Numbers', 'type' => 'boolean', 'default' => 'true', 'description' => 'Passwords must contain numbers'],
            'password_require_symbols' => ['label' => 'Require Symbols', 'type' => 'boolean', 'default' => 'false', 'description' => 'Passwords must contain special characters'],
            'login_attempts' => ['label' => 'Max Login Attempts', 'type' => 'number', 'default' => '5', 'description' => 'Failed login attempts before lockout'],
            'lockout_duration' => ['label' => 'Lockout Duration (minutes)', 'type' => 'number', 'default' => '15', 'description' => 'Duration of account lockout after failed attempts'],
            'session_lifetime' => ['label' => 'Session Lifetime (minutes)', 'type' => 'number', 'default' => '120', 'description' => 'Web session duration'],
            'enable_2fa' => ['label' => 'Enable Two-Factor Auth', 'type' => 'boolean', 'default' => 'false', 'description' => 'Require 2FA for admin users'],
            'enable_audit_log' => ['label' => 'Enable Audit Log', 'type' => 'boolean', 'default' => 'true', 'description' => 'Log all critical actions to audit trail'],
            'audit_log_retention_days' => ['label' => 'Audit Log Retention (days)', 'type' => 'number', 'default' => '90', 'description' => 'Number of days to retain audit logs'],
            'rate_limiting_enabled' => ['label' => 'Enable Rate Limiting', 'type' => 'boolean', 'default' => 'true', 'description' => 'Globally enable rate limiting'],
            'recaptcha_site_key' => ['label' => 'reCAPTCHA Site Key', 'type' => 'text', 'default' => '', 'description' => 'Google reCAPTCHA site key'],
            'recaptcha_secret_key' => ['label' => 'reCAPTCHA Secret Key', 'type' => 'password', 'default' => '', 'description' => 'Google reCAPTCHA secret key'],
        ];
    }

    private function getMaintenanceFields(): array
    {
        return [
            'maintenance_mode' => ['label' => 'Maintenance Mode', 'type' => 'boolean', 'default' => 'false', 'description' => 'Enable maintenance mode for the entire application'],
            'maintenance_message' => ['label' => 'Maintenance Message', 'type' => 'textarea', 'default' => 'We are currently undergoing scheduled maintenance. Please check back shortly.', 'description' => 'Message shown to users during maintenance'],
            'maintenance_retry_after' => ['label' => 'Retry After (minutes)', 'type' => 'number', 'default' => '5', 'description' => 'Suggested retry interval for maintenance mode'],
            'allowed_ips' => ['label' => 'Allowed IPs (maintenance bypass)', 'type' => 'textarea', 'default' => '', 'description' => 'One IP per line that can access the app during maintenance'],
            'enable_debug_mode' => ['label' => 'Debug Mode', 'type' => 'boolean', 'default' => 'false', 'description' => 'Application debug mode (disable in production)'],
            'log_level' => ['label' => 'Log Level', 'type' => 'select', 'default' => 'warning', 'options' => ['debug' => 'Debug', 'info' => 'Info', 'notice' => 'Notice', 'warning' => 'Warning', 'error' => 'Error', 'critical' => 'Critical', 'alert' => 'Alert', 'emergency' => 'Emergency'], 'description' => 'Minimum log level to record'],
            'log_retention_days' => ['label' => 'Log Retention (days)', 'type' => 'number', 'default' => '30', 'description' => 'Number of days to retain application logs'],
            'log_max_files' => ['label' => 'Max Log Files', 'type' => 'number', 'default' => '30', 'description' => 'Maximum number of daily log files to keep'],
        ];
    }

    private function getValidationRules(string $group): array
    {
        $rules = [];
        $defaults = $this->getGroupDefinitions()[$group]['fields'] ?? [];

        foreach ($defaults as $key => $field) {
            $fieldRules = ['nullable'];

            switch ($field['type']) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                case 'range':
                    $fieldRules[] = 'numeric';
                    break;
                case 'boolean':
                    $fieldRules[] = 'boolean';
                    break;
                case 'color':
                    $fieldRules[] = 'regex:/^#[a-fA-F0-9]{6}$/';
                    break;
                case 'password':
                    $fieldRules[] = 'string';
                    break;
                default:
                    $fieldRules[] = 'string';
                    break;
            }

            $rules[$key] = $fieldRules;
        }

        return $rules;
    }

    private function getConfigDefinition(string $key): array
    {
        foreach ($this->getGroupDefinitions() as $group => $definition) {
            if (strpos($key, $group . '.') === 0) {
                $localKey = str_replace($group . '.', '', $key);
                if (isset($definition['fields'][$localKey])) {
                    $field = $definition['fields'][$localKey];
                    return [
                        'type' => $field['type'] === 'boolean' ? 'boolean' : ($field['type'] === 'number' || $field['type'] === 'range' ? 'integer' : 'string'),
                        'description' => $field['description'] ?? null,
                        'default' => $field['default'] ?? null,
                    ];
                }
            }
        }
        return ['type' => 'string', 'description' => null, 'default' => null];
    }

    public function clearCache(): void
    {
        Cache::forget($this->cacheKey);
    }

    public function getDefaults(): array
    {
        $defaults = [];
        foreach ($this->getGroupDefinitions() as $group => $definition) {
            foreach ($definition['fields'] as $key => $field) {
                $defaults[$group . '.' . $key] = $field['default'] ?? '';
            }
        }
        return $defaults;
    }

    public function seedDefaults(): void
    {
        foreach ($this->getDefaults() as $key => $default) {
            SystemConfig::firstOrCreate(
                ['key' => $key],
                [
                    'value' => $default,
                    'type' => $this->getConfigDefinition($key)['type'] ?? 'string',
                    'description' => $this->getConfigDefinition($key)['description'] ?? null,
                ]
            );
        }
        $this->clearCache();
    }

    public function testSmtp(): array
    {
        $smtp = $this->getGroup('smtp');
        if (empty($smtp['mail_host'])) {
            return ['success' => false, 'message' => 'SMTP not configured.'];
        }
        return ['success' => true, 'message' => 'SMTP configuration looks valid. (Test send is simulated — use Artisan to actually test.)'];
    }

    public function testSms(): array
    {
        $sms = $this->getGroup('sms');
        if (!$sms['sms_enabled'] ?? false) {
            return ['success' => false, 'message' => 'SMS is disabled.'];
        }
        return ['success' => true, 'message' => 'SMS configuration looks valid.'];
    }

    public function toggleMaintenance(bool $enabled): void
    {
        $this->set('maintenance.maintenance_mode', $enabled ? 'true' : 'false', 'boolean');
    }
}
