<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\HandleCors as Middleware;

class HandleCors extends Middleware
{
    protected $allowedOrigins = [env('FRONTEND_URL', 'http://localhost:3000')];

    protected $allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    protected $allowedHeaders = ['Content-Type', 'X-Requested-With', 'X-XSRF-TOKEN', 'Authorization'];

    protected $supportsCredentials = true;
}
