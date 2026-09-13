<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app-base" content="{{ url('/') }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/png" href="{{ asset('images/favicon-32.png') }}">
        <link rel="icon" type="image/png" sizes="64x64" href="{{ asset('images/favicon-64.png') }}">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        @vite(['resources/js/app.jsx'])
        @routes
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>