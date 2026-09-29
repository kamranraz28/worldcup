<?php

namespace App\Support;

/**
 * Normalises phone numbers to a single comparable local form.
 *
 * The app is Bangladeshi focused (BDT, Dhaka), so every number is reduced to
 * its 11-digit local form: '01712345678'. That makes '01712345678',
 * '+8801712345678' and '880 1712 3456 78' all match the same ticket lookup.
 */
final class PhoneNumber
{
    public const COUNTRY_CODE = '880';

    public static function normalize(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?? '';

        if ($digits === '') {
            return null;
        }

        // Drop an international prefix: 8801712345678 / 008801712345678
        if (str_starts_with($digits, '00' . self::COUNTRY_CODE)) {
            $digits = substr($digits, 2 + strlen(self::COUNTRY_CODE));
        } elseif (str_starts_with($digits, self::COUNTRY_CODE)) {
            $digits = substr($digits, strlen(self::COUNTRY_CODE));
        }

        // Restore the national trunk prefix the caller dropped.
        if (strlen($digits) === 10) {
            $digits = '0' . $digits;
        }

        return $digits;
    }

    /**
     * A loose shape check so obvious junk never reaches the database.
     */
    public static function isValid(?string $phone): bool
    {
        $normalized = self::normalize($phone);

        return $normalized !== null && preg_match('/^01[3-9]\d{8}$/', $normalized) === 1;
    }

    /**
     * Loose check for lookups (ticket tracking, search). Unlike isValid() this
     * accepts any number that normalises to a usable local form — including
     * legacy landlines that pre-date the mobile-only registration rule.
     */
    public static function isValidLookup(?string $phone): bool
    {
        $normalized = self::normalize($phone);

        return $normalized !== null && strlen($normalized) >= 10;
    }
}
