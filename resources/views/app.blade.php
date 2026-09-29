<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app-base" content="{{ url('/') }}">
        <title inertia>{{ config('app.name', 'TicketClub') }}</title>
        <link rel="icon" href="{{ asset('ticketclub-favicon.ico') }}" type="image/x-icon">
        <link rel="shortcut icon" href="{{ asset('ticketclub-favicon.ico') }}" type="image/x-icon">
        <script>
            // Apply the saved theme before first paint to avoid a flash.
            (function () {
                try {
                    var stored = localStorage.getItem('theme');
                    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (dark) document.documentElement.classList.add('dark');
                } catch (e) {}
            })();
        </script>
        @vite(['resources/js/app.jsx'])
        @routes
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>