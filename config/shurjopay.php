<?php

return [
    'base_url' => env('SHURJOPAY_BASE_URL', 'https://engine.sandbox.shurjopayment.com/api'),
    'username' => env('SHURJOPAY_USERNAME'),
    'password' => env('SHURJOPAY_PASSWORD'),
    'prefix' => env('SHURJOPAY_PREFIX', 'SP'),
    'currency' => env('SHURJOPAY_CURRENCY', 'BDT'),
];
